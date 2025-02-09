import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL_NEST;
const API_URL_EXPRESS = process.env.NEXT_PUBLIC_API_URL_EXPRESS;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const apiExpress = axios.create({
  baseURL: API_URL_EXPRESS,
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

apiExpress.interceptors.request.use((config) => {
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

export type ApiOrder = {
  id: string;
  reference: { value: string };
  orderDate: string;
  deliveryDate?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
};

export type Order = {
  id: string;
  reference: string;
  orderDate: string;
  deliveryDate?: string;
  createdByName: string;
  updatedByName?: string;
  createdAt: string;
  updatedAt: string;
};

export const getOrders = async (): Promise<ApiOrder[]> => {
  try {
    const response = await api.get<ApiOrder[]>("/orders");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data?.message || "Erreur inconnue lors de la récupération des commandes.";
    }
    throw "Une erreur inconnue s'est produite.";
  }
};

export const getOrderById = async (id: string): Promise<ApiOrder | null> => {
  try {
    const response = await api.get<ApiOrder>(`/orders/${id}`);
    return response.data;
  } catch {
    return null;
  }
};

export const createOrder = async (
  orderData: {
    reference: string;
    orderDate: string;
    deliveryDate?: string;
  },
  token: string
): Promise<{ id: string; message: string }> => {
  try {
    const response = await api.post("/orders", orderData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data?.message || "Erreur inconnue lors de la création de la commande.";
    }
    throw "Une erreur inconnue s'est produite.";
  }
};

export const updateOrder = async (
  id: string,
  orderData: Partial<Omit<ApiOrder, "id" | "createdBy" | "updatedBy" | "createdAt" | "updatedAt">>,
  token: string
): Promise<{ id: string; message: string }> => {
  try {
    const response = await api.put(`/orders/${id}`, orderData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { id, ...response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data?.message || "Erreur inconnue lors de la mise à jour de la commande.";
    }
    throw "Une erreur inconnue s'est produite.";
  }
};

export const deleteOrder = async (id: string, token: string): Promise<void> => {
  try {
    await api.delete(`/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data?.message || "Erreur inconnue lors de la suppression de la commande.";
    }
    throw "Une erreur inconnue s'est produite.";
  }
};

export type ApiOrderPart = {
  orderId: string;
  partId: string;
  quantityOrdered: { value: number } | number;
};

export type OrderPart = {
  orderId: string;
  partId: string;
  quantityOrdered: number;
};

export const getOrderParts = async (orderId: string): Promise<ApiOrderPart[]> => {
  try {
    const response = await api.get<ApiOrderPart[]>(`/order-parts/${orderId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data?.message || "Erreur inconnue lors de la récupération des pièces.";
    }
    throw "Une erreur inconnue s'est produite.";
  }
};

export const addPartToOrder = async (
  orderId: string,
  partId: string,
  quantityOrdered: number,
  token: string
): Promise<void> => {
  try {
    await api.post(
      "/order-parts",
      { orderId, partId, quantityOrdered },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data?.message || "Erreur inconnue lors de l'ajout de la pièce à la commande.";
    }
    throw "Une erreur inconnue s'est produite.";
  }
};

export const updatePartInOrder = async (
  orderId: string,
  partId: string,
  quantityOrdered: number,
  token: string
): Promise<void> => {
  try {
    await api.put(
      `/order-parts/${orderId}/${partId}`,
      { quantityOrdered },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data?.message || "Erreur inconnue lors de la mise à jour de la quantité.";
    }
    throw "Une erreur inconnue s'est produite.";
  }
};

export const removePartFromOrder = async (
  orderId: string,
  partId: string,
  token: string
): Promise<void> => {
  try {
    await api.delete(`/order-parts/${orderId}/${partId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data?.message || "Erreur inconnue lors de la suppression de la pièce.";
    }
    throw "Une erreur inconnue s'est produite.";
  }
};

export type ApiTrial = {
  userId: string;
  motorcycleId: string;
  startDate: string;
  endDate: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
};

export type EnrichedTrial = {
  userId: string;
  username: string;
  motorcycleId: string;
  motorcycleBrand: string;
  startDate: string;
  endDate: string;
  createdByName: string;
  updatedByName?: string;
  createdAt: string;
  updatedAt: string;
};

export const getTrialById = async (userId: string, motorcycleId: string): Promise<ApiTrial | null> => {
  try {
    const response = await api.get<ApiTrial>(`/trials/${userId}/${motorcycleId}`);
    return response.data;
  } catch {
    return null;
  }
};

export const createTrial = async (
  trialData: { userId: string; motorcycleId: string; startDate: string; endDate: string },
  token: string
): Promise<{ message: string }> => {
  try {
    const response = await api.post("/trials", trialData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Erreur inconnue lors de la création de l'essai.";
  }
};

export const updateTrial = async (
  userId: string,
  motorcycleId: string,
  trialData: Partial<Omit<ApiTrial, "userId" | "motorcycleId" | "createdBy" | "updatedBy" | "createdAt" | "updatedAt">>,
  token: string
): Promise<{ message: string }> => {
  try {
    const response = await api.put(`/trials/${userId}/${motorcycleId}`, trialData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Erreur inconnue lors de la mise à jour de l'essai.";
  }
};

export const deleteTrial = async (userId: string, motorcycleId: string, token: string): Promise<void> => {
  try {
    await api.delete(`/trials/${userId}/${motorcycleId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    throw error.response?.data?.message || "Erreur inconnue lors de la suppression de l'essai.";
  }
};

export type ApiMotorcycle = {
  id: string;
  brand: { value: string };
  model: { value: string };
  purchaseDate: string;
  licensePlate: { value: string };
  kilometers: { value: number };
  warrantyDate: string;
  maintenanceInterval: { value: number };
  ownerId: string;
  createdBy: string;
  updatedBy?: string;
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
  updatedByName?: string;
  createdAt: string;
  updatedAt: string;
};

export const getMotorcycleById = async (id: string): Promise<{ brand: string } | null> => {
  try {
    const response = await apiExpress.get(`/motorcycles/${id}`);
    const brand = response.data?.brand?.value || response.data?.brand || "Moto inconnue";
    return { brand };
  } catch (error: any) {
    console.error(`Erreur lors de la récupération de la moto ${id} :`, error.response?.data || error);
    return { brand: "Moto inconnue" };
  }
};

export const getMotorcycles = async (): Promise<ApiMotorcycle[]> => {
  try {
    const response = await apiExpress.get<ApiMotorcycle[]>("/motorcycles");

    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la récupération des motos :", error.response?.data || error);
    throw error.response?.data?.message || "Erreur inconnue lors de la récupération des motos.";
  }
};


export const getTrials = async (): Promise<ApiTrial[]> => {
  try {
    const response = await api.get<ApiTrial[]>("/trials");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Erreur inconnue lors de la récupération des essais.";
  }
};

export const getEnrichedTrials = async (): Promise<EnrichedTrial[]> => {
  try {
    const trials = await getTrials();

    const enrichedTrials = await Promise.all(
      trials.map(async (trial) => {
        const user = await getUserById(trial.userId);
        const motorcycle = await getMotorcycleById(trial.motorcycleId);
        const createdByUser = await getUserById(trial.createdBy);
        const updatedByUser = trial.updatedBy ? await getUserById(trial.updatedBy) : null;

        return {
          userId: trial.userId,
          username: user?.username.value || "Utilisateur inconnu",
          motorcycleId: trial.motorcycleId,
          motorcycleBrand: motorcycle?.brand || "Moto inconnue",
          startDate: trial.startDate,
          endDate: trial.endDate,
          createdByName: createdByUser?.username.value || "Inconnu",
          updatedByName: updatedByUser?.username.value || "N/A",
          createdAt: trial.createdAt,
          updatedAt: trial.updatedAt,
        };
      })
    );

    return enrichedTrials;
  } catch (error) {
    throw error.response?.data?.message || "Erreur inconnue lors de la récupération des essais enrichis.";
  }
};


export default api;
