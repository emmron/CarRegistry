export interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  registrationExpiry: string;
  isRegistrationValid?: boolean;
}

// Helper function to generate dates
const generateDate = (monthsFromNow: number): string => {
  const date = new Date();
  date.setMonth(date.getMonth() + monthsFromNow);
  return date.toISOString();
};

export const cars: Car[] = [
  {
    id: 1,
    make: "Tesla",
    model: "Model S",
    year: 2023,
    registrationExpiry: generateDate(8)
  },
  {
    id: 2,
    make: "BMW",
    model: "M5",
    year: 2022,
    registrationExpiry: generateDate(-2)
  },
  {
    id: 3,
    make: "Porsche",
    model: "911 GT3",
    year: 2023,
    registrationExpiry: generateDate(1)
  },
  {
    id: 4,
    make: "Mercedes-Benz",
    model: "AMG GT",
    year: 2022,
    registrationExpiry: generateDate(5)
  },
  {
    id: 5,
    make: "Audi",
    model: "RS e-tron GT",
    year: 2023,
    registrationExpiry: generateDate(-1)
  },
  {
    id: 6,
    make: "Lamborghini",
    model: "Huracán",
    year: 2022,
    registrationExpiry: generateDate(3)
  },
  {
    id: 7,
    make: "Ferrari",
    model: "SF90 Stradale",
    year: 2023,
    registrationExpiry: generateDate(10)
  },
  {
    id: 8,
    make: "McLaren",
    model: "720S",
    year: 2022,
    registrationExpiry: generateDate(2)
  },
  {
    id: 9,
    make: "Aston Martin",
    model: "DBS",
    year: 2023,
    registrationExpiry: generateDate(6)
  },
  {
    id: 10,
    make: "Bentley",
    model: "Continental GT",
    year: 2022,
    registrationExpiry: generateDate(4)
  },
  {
    id: 11,
    make: "Rolls-Royce",
    model: "Phantom",
    year: 2023,
    registrationExpiry: generateDate(9)
  },
  {
    id: 12,
    make: "Maserati",
    model: "MC20",
    year: 2022,
    registrationExpiry: generateDate(-3)
  },
  {
    id: 13,
    make: "Bugatti",
    model: "Chiron",
    year: 2023,
    registrationExpiry: generateDate(7)
  },
  {
    id: 14,
    make: "Lexus",
    model: "LC 500",
    year: 2022,
    registrationExpiry: generateDate(0)
  },
  {
    id: 15,
    make: "Tesla",
    model: "Model X Plaid",
    year: 2023,
    registrationExpiry: generateDate(11)
  }
];
