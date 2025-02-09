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
    await apiExpress.put(`/api/motorcycles/${id}`, motorcycleData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
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
    const response = await apiExpress.get<ApiMotorcycle>(`/api/motorcycles/${id}`);
    return response.data;
  } catch {
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

export default apiExpress;
