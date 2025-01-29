const generateCars = () => {
  const cars = [];
  const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  const makes = ["Tesla", "BMW", "Porsche", "Mercedes", "Audi", "Lamborghini", "Ferrari", "McLaren", "Bugatti", "Rolls-Royce", "Bentley", "Aston Martin", "Maserati", "Koenigsegg"];
  const models = {
    "Tesla": { models: ["Model S Plaid", "Model X Plaid", "Roadster", "Cybertruck"], basePrice: 135000 },
    "BMW": { models: ["M8 Competition", "M5 CS", "XM Label Red", "M4 CSL"], basePrice: 165000 },
    "Porsche": { models: ["911 GT3 RS", "918 Spyder", "Taycan Turbo S", "GT2 RS"], basePrice: 225000 },
    "Mercedes": { models: ["AMG GT Black Series", "AMG ONE", "SL 63 AMG", "G 63 AMG"], basePrice: 325000 },
    "Audi": { models: ["RS e-tron GT", "R8 V10", "RS6 Avant", "RS Q8"], basePrice: 145000 },
    "Lamborghini": { models: ["Revuelto", "Huracan STO", "Urus Performante", "Countach LPI"], basePrice: 498000 },
    "Ferrari": { models: ["SF90 Stradale", "LaFerrari", "F8 Tributo", "812 Competizione"], basePrice: 625000 },
    "McLaren": { models: ["765LT Spider", "P1", "Speedtail", "Senna"], basePrice: 520000 },
    "Bugatti": { models: ["Chiron Super Sport", "Mistral", "Divo", "La Voiture Noire"], basePrice: 3900000 },
    "Rolls-Royce": { models: ["Phantom", "Cullinan", "Ghost Black Badge", "Boat Tail"], basePrice: 475000 },
    "Bentley": { models: ["Continental GT Speed", "Flying Spur", "Bentayga EWB", "Batur"], basePrice: 335000 },
    "Aston Martin": { models: ["DBS 770", "Valkyrie", "DBX707", "Vantage F1"], basePrice: 425000 },
    "Maserati": { models: ["MC20", "GranTurismo", "Grecale Trofeo", "Levante"], basePrice: 285000 },
    "Koenigsegg": { models: ["Jesko", "Gemera", "Regera", "CC850"], basePrice: 2900000 }
  };

  const perthSuburbs = ["Perth CBD", "Northbridge", "Subiaco", "Fremantle", "Cottesloe", "Scarborough", "Claremont", "South Perth"];
  const dealerships = ["Barbagallo", "AutoClassic", "Perth City", "Diesel Motors", "DVG", "John Hughes"];

  // Generate 2000 cars
  for (let i = 1; i <= 2000; i++) {
    const make = makes[random(0, makes.length - 1)];
    const model = models[make].models[random(0, models[make].models.length - 1)];
    const basePrice = models[make].basePrice;
    const priceVariation = 0.8 + (Math.random() * 0.4);
    const price = Math.round(basePrice * priceVariation);
    
    const daysOffset = random(-30, 365);
    const registrationExpiry = new Date();
    registrationExpiry.setDate(registrationExpiry.getDate() + daysOffset);
    
    const suburb = perthSuburbs[random(0, perthSuburbs.length - 1)];
    const dealership = dealerships[random(0, dealerships.length - 1)];
    const vin = `${make[0]}${model[0]}${random(100000, 999999)}${new Date().getFullYear() % 100}${i.toString().padStart(4, '0')}`;
    
    const car = {
      id: i,
      make,
      model,
      year: random(2021, 2024),
      price,
      registrationExpiry: registrationExpiry.toISOString(),
      vin,
      location: `${dealership} - ${suburb}, WA`,
      lastUpdated: new Date().toISOString(),
      isRegistrationValid: registrationExpiry > new Date(),
      daysUntilExpiry: Math.ceil((registrationExpiry - new Date()) / (1000 * 60 * 60 * 24)),
      displayName: `${make} ${model} (${dealership} - ${suburb}, WA) - $${price.toLocaleString()}`
    };

    // Add computed properties
    car.status = car.daysUntilExpiry < 0 ? "Expired" : car.daysUntilExpiry < 30 ? "Expiring Soon" : "Valid";
    car.statusColor = car.status === "Expired" ? "#ef4444" : car.status === "Expiring Soon" ? "#f97316" : "#22c55e";
    car.age = new Date().getFullYear() - car.year;
    car.depreciationPercent = Math.min(100, car.age * 12);
    car.currentValue = Math.round(car.price * (1 - (car.depreciationPercent / 100)));
    car.expiryCountdown = car.daysUntilExpiry < 0 
      ? `Expired ${Math.abs(car.daysUntilExpiry)} days ago`
      : car.daysUntilExpiry === 0 ? "Expires today"
      : car.daysUntilExpiry === 1 ? "Expires tomorrow"
      : `Expires in ${car.daysUntilExpiry} days`;
    
    cars.push(car);
  }
  
  return cars;
};

// Cache the generated cars
let cachedCars = null;

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  try {
    // Generate cars if not cached
    if (!cachedCars) {
      cachedCars = generateCars();
    }

    // Get filters from query string
    const make = event.queryStringParameters?.make;
    const status = event.queryStringParameters?.status;
    
    // Apply filters
    let filteredCars = cachedCars;
    if (make) {
      filteredCars = filteredCars.filter(car => 
        car.make.toLowerCase().includes(make.toLowerCase())
      );
    }
    if (status) {
      filteredCars = filteredCars.filter(car => 
        car.status.toLowerCase() === status.toLowerCase()
      );
    }

    // Calculate stats
    const stats = {
      totalCars: filteredCars.length,
      expiredCount: filteredCars.filter(car => !car.isRegistrationValid).length,
      validCount: filteredCars.filter(car => car.isRegistrationValid).length,
      expiringCount: filteredCars.filter(car => car.daysUntilExpiry >= 0 && car.daysUntilExpiry < 30).length,
      averageYear: Math.round(filteredCars.reduce((sum, car) => sum + car.year, 0) / filteredCars.length),
      uniqueMakes: new Set(filteredCars.map(car => car.make)).size,
      mostCommonMake: [...new Set(filteredCars.map(car => car.make))]
        .map(make => ({
          make,
          count: filteredCars.filter(car => car.make === make).length
        }))
        .sort((a, b) => b.count - a.count)[0]?.make || '',
      averagePrice: Math.round(filteredCars.reduce((sum, car) => sum + car.price, 0) / filteredCars.length),
      mostExpensiveCar: filteredCars.sort((a, b) => b.price - a.price)[0]?.displayName || '',
      mostPopularLocation: [...new Set(filteredCars.map(car => car.location))]
        .map(location => ({
          location,
          count: filteredCars.filter(car => car.location === location).length
        }))
        .sort((a, b) => b.count - a.count)[0]?.location || '',
      totalValue: filteredCars.reduce((sum, car) => sum + car.price, 0),
      lastUpdated: new Date().toISOString()
    };

    // Return response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        cars: filteredCars,
        stats,
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to process request' })
    };
  }
}; 