import axios from "axios";

const API_URL_EXPRESS = process.env.NEXT_PUBLIC_API_URL_EXPRESS;

const apiExpress = axios.create({
  baseURL: API_URL_EXPRESS,
  headers: {
    "Content-Type": "application/json",
  },
});

apiExpress.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});


export type ApiMotorcycle = {
  id: string;
  brand: string;
  model: string;
  purchaseDate: string;
  licensePlate: string;
  kilometers: number;
  warrantyDate: string;
  maintenanceInterval: number;
  ownerId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
};

export type Motorcycle = {
  id: string;
  brand: string;
  model: string;
  purchaseDate: string;
  licensePlate: string;
  kilometers: number;
  warrantyDate: string;
  maintenanceInterval: number;
  ownerId: string;
  createdByName: string;
  updatedByName: string;
  createdAt: string;
  updatedAt: string;
};


export const createMotorcycle = async (
  motorcycleData: Omit<Motorcycle, "id" | "createdByName" | "updatedByName" | "createdAt" | "updatedAt">,
  token: string
): Promise<void> => {
  try {
    await apiExpress.post("/api/motorcycles", motorcycleData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    throw error.response?.data?.message || "Erreur inconnue lors de la création de la moto.";
  }
};


export const updateMotorcycle = async (
  id: string,
  motorcycleData: Partial<Omit<Motorcycle, "id" | "createdByName" | "updatedByName" | "createdAt" | "updatedAt">>,
  token: string
): Promise<void> => {
  try {
    console.log("1. Données reçues dans updateMotorcycle:", motorcycleData);
    
    const formattedData = {
      brand: motorcycleData.brand,
      model: motorcycleData.model,
      date: motorcycleData.purchaseDate,
      licensePlate: motorcycleData.licensePlate,
      kilometers: motorcycleData.kilometers,
      warranty: motorcycleData.warrantyDate,
      maintenanceInterval: motorcycleData.maintenanceInterval,
      ownerId: motorcycleData.ownerId
    };

    console.log("2. Données formatées pour l'API:", formattedData);
    
    const response = await apiExpress.put(`/api/motorcycles/${id}`, formattedData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    console.log("3. Réponse de l'API:", response.data);
  } catch (error: any) {
    console.error("4. Erreur dans updateMotorcycle:", error.response?.data || error);
    throw error.response?.data?.message || "Erreur inconnue lors de la mise à jour de la moto.";
  }
};


export const deleteMotorcycle = async (id: string, token: string): Promise<void> => {
  try {
    await apiExpress.delete(`/api/motorcycles/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    throw error.response?.data?.message || "Erreur inconnue lors de la suppression de la moto.";
  }
};


export const getMotorcycleById = async (id: string): Promise<ApiMotorcycle | null> => {
  try {
    const token = localStorage.getItem("token");
    console.log("Token dans getMotorcycleById :", token); 

    const response = await apiExpress.get<ApiMotorcycle>(`/api/motorcycles/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de la moto :", error); 
    return null;
  }
};



export const getMotorcycles = async (): Promise<ApiMotorcycle[]> => {
  try {
    const response = await apiExpress.get<ApiMotorcycle[]>("/api/motorcycles");
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Erreur inconnue lors de la récupération des motos.";
  }
};



export type Rental = {
  id: string;
  reference: string;
  rentalDate: string;
  price: number;
  motorcycleId: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

export const createRental = async (
  rentalData: Omit<Rental, 'id' | 'createdAt' | 'updatedAt'>,
  token: string
): Promise<void> => {
  try {
    await apiExpress.post('/api/rentals', rentalData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    throw error.response?.data?.message || 'Erreur inconnue lors de la création de la location.';
  }
};

export const updateRental = async (
  id: string,
  rentalData: Partial<Omit<Rental, 'id' | 'createdAt' | 'updatedAt'>>,
  token: string
): Promise<void> => {
  try {
    await apiExpress.put(`/api/rentals/${id}`, rentalData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    throw error.response?.data?.message || 'Erreur inconnue lors de la mise à jour de la location.';
  }
};

export const deleteRental = async (id: string, token: string): Promise<void> => {
  try {
    await apiExpress.delete(`/api/rentals/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    throw error.response?.data?.message || 'Erreur inconnue lors de la suppression de la location.';
  }
};

export const getRentalById = async (id: string): Promise<Rental | null> => {
  try {
    const token = localStorage.getItem('token');
    const response = await apiExpress.get<Rental>(`/api/rentals/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de la location:', error);
    return null;
  }
};

export const getRentals = async (): Promise<Rental[]> => {
  try {
    const response = await apiExpress.get<Rental[]>('/api/rentals');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Erreur inconnue lors de la récupération des locations.';
  }
};

export default apiExpress;
