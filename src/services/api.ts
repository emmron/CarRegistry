import axios from 'axios';

// Determine the API URL based on environment
const isDevelopment = import.meta.env.DEV;
const API_URL = isDevelopment 
  ? 'http://localhost:5074/api/cars'
  : 'https://car-registry-api.azurewebsites.net/api/cars';

export interface Car {
    id: number;
    make: string;
    model: string;
    year: number;
    price: number;
    registrationExpiry: string;
    vin: string;
    location: string;
    lastUpdated: string;
    isRegistrationValid: boolean;
    daysUntilExpiry: number;
    displayName: string;
    status: string;
    statusColor: string;
    age: number;
    depreciationPercent: number;
    currentValue: number;
    expiryCountdown: string;
}

export interface CarStats {
    totalCars: number;
    expiredCount: number;
    validCount: number;
    expiringCount: number;
    averageYear: number;
    uniqueMakes: number;
    mostCommonMake: string;
    averagePrice: number;
    mostExpensiveCar: string;
    mostPopularLocation: string;
    totalValue: number;
    lastUpdated: string;
}

interface CarResponse {
    cars: Car[];
    stats: CarStats;
    timestamp: string;
}

export const api = {
    getCars: async (make?: string, status?: string): Promise<CarResponse> => {
        try {
            let url = API_URL;
            const params = new URLSearchParams();
            if (make) params.append('make', make);
            if (status) params.append('status', status);
            
            const queryString = params.toString();
            if (queryString) url += `?${queryString}`;
            
            console.log('Fetching cars from:', url);
            const response = await axios.get<CarResponse>(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching cars:', error);
            throw error;
        }
    },

    checkHealth: async (): Promise<boolean> => {
        try {
            const response = await axios.get(API_URL);
            return response.status === 200;
        } catch (error) {
            console.error('Health check failed:', error);
            return false;
        }
    }
}; 