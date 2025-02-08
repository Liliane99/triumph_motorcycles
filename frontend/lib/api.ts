import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL_NEST;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export type ApiUser = {
  id: string;
  username: { value: string };
  email: { value: string };
  role: { value: "admin" | "manager" | "client" };
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  phoneNumber?: { value: string };
  licenseNumber?: { value: string };
  experienceLevel?: { value: string };
};

export type User = {
  id: string;
  username: string;
  email: string;
  role: "admin" | "manager" | "client";
  createdByName: string;
  updatedByName: string;
  createdAt: string;
  updatedAt: string;
  phoneNumber?: string;
  licenseNumber?: string;
  experienceLevel?: string;
};

export const createUser = async (
  userData: Omit<User, "id" | "createdByName" | "updatedByName" | "createdAt" | "updatedAt">,
  token: string
): Promise<void> => {
  try {
    await api.post("/users", userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    throw error.response?.data?.message || "Erreur inconnue";
  }
};

export const getUsers = async (): Promise<ApiUser[]> => {
  try {
    const response = await api.get<ApiUser[]>("/users");
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Erreur inconnue";
  }
};

export const getUserById = async (id: string): Promise<ApiUser | null> => {
  try {
    const response = await api.get<ApiUser>(`/users/${id}`);
    return response.data;
  } catch {
    return {
      id,
      username: { value: "Utilisateur inconnu" },
      email: { value: "" },
      role: { value: "client" },
      createdAt: "",
      updatedAt: "",
    };
  }
};

export const updateUser = async (
  id: string,
  userData: Partial<Omit<User, "id" | "createdByName" | "updatedByName" | "createdAt" | "updatedAt">>,
  token: string
): Promise<void> => {
  try {
    await api.put(`/users/${id}`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    throw error.response?.data?.message || "Erreur inconnue";
  }
};

export const changePassword = async (
  id: string,
  oldPassword: string,
  newPassword: string,
  token: string
): Promise<void> => {
  try {
    await api.put(`/users/${id}/password`, { oldPassword, newPassword }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    throw error.response?.data?.message || "Erreur inconnue";
  }
};


export type ApiPart = {
  id: string;
  reference: { value: string };
  type: { value: string };
  name: { value: string };
  quantityInStock: { value: number };
  partThreshold: { value: number };
  unitPrice: { value: number };
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
};

export type Part = {
  id: string;
  reference: string;
  type: "oil" | "tire" | "brake" | "filter" | "chain" | "battery"; 
  name: string;
  quantityInStock: number;
  partThreshold: number;
  unitPrice: number;
  createdByName: string; 
  updatedByName: string;
  createdAt: string;
  updatedAt: string;
};


export const getParts = async (): Promise<ApiPart[]> => {
  try {
    const response = await api.get<ApiPart[]>("/parts");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data?.message || "Erreur inconnue lors de la récupération des pièces.";
    }
    throw "Une erreur inconnue s'est produite.";
  }
};

export const getPartById = async (id: string): Promise<ApiPart | null> => {
  try {
    const response = await api.get<ApiPart>(`/parts/${id}`);
    return response.data;
  } catch {
    return null;
  }
};

export const createPart = async (
  partData: Omit<ApiPart, "id" | "createdBy" | "updatedBy" | "createdAt" | "updatedAt">,
  token: string
): Promise<void> => {
  try {
    await api.post("/parts", partData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    throw error.response?.data?.message || "Erreur inconnue lors de la création de la pièce.";
  }
};

export const updatePart = async (
  id: string,
  partData: Partial<Omit<ApiPart, "id" | "createdBy" | "updatedBy" | "createdAt" | "updatedAt">>,
  token: string
): Promise<void> => {
  try {
    await api.put(`/parts/${id}`, partData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    throw error.response?.data?.message || "Erreur inconnue lors de la mise à jour de la pièce.";
  }
};

export const deletePart = async (id: string, token: string): Promise<void> => {
  try {
    await api.delete(`/parts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    throw error.response?.data?.message || "Erreur inconnue lors de la suppression de la pièce.";
  }
};
export default api;
