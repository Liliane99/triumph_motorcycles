import axios from "axios";
import { format, parseISO, isValid } from "date-fns";

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
    const response = await apiExpress.get(`/api/motorcycles/${id}`);
    const brand = response.data?.brand?.value || response.data?.brand || "Moto inconnue";
    return { brand };
  } catch (error: any) {
    console.error(`Erreur lors de la récupération de la moto ${id} :`, error.response?.data || error);
    return { brand: "Moto inconnue" };
  }
};

export const getMotorcycles = async (): Promise<ApiMotorcycle[]> => {
  try {
    const response = await apiExpress.get<ApiMotorcycle[]>("/api/motorcycles");

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

export type ApiIncident = {
  id: string;
  reference: { value: string };
  description: { value: string };
  status: { value: "opened" | "resolved" };
  date: { value: string };  // Correction ici, la date est un objet avec une propriété value
  motorcycleId: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
};

export type Incident = {
  id: string;
  reference: string;
  description: string;
  status: "opened" | "resolved";
  date: string;
  motorcycleLicensePlate: string;
  createdByName: string;
  updatedByName?: string;
  createdAt: string;
  updatedAt: string;
};

export const getIncidents = async (): Promise<Incident[]> => {
  try {
    const response = await api.get<ApiIncident[]>("/incidents");
    
    const enrichedIncidents = await Promise.all(
      response.data.map(async (incident) => {
        try {
          const [createdByUser, updatedByUser, motorcycle] = await Promise.all([
            getUserById(incident.createdBy),
            incident.updatedBy ? getUserById(incident.updatedBy) : Promise.resolve(null),
            getMotorcycleById(incident.motorcycleId)
          ]);

          // Pour le debug
          console.log('Raw incident:', incident);
          console.log('CreatedByUser:', createdByUser);
          console.log('UpdatedByUser:', updatedByUser);
          console.log('Motorcycle:', motorcycle);

          const enrichedIncident: Incident = {
            id: incident.id,
            reference: incident.reference.value,
            description: incident.description.value,
            status: incident.status.value,
            // La date est dans l'objet value
            date: typeof incident.date === 'object' && incident.date.value 
              ? new Date(incident.date.value).toISOString() 
              : new Date(incident.date).toISOString(),
            motorcycleLicensePlate: motorcycle?.brand || "Moto inconnue",
            createdByName: createdByUser?.username?.value || "Inconnu",
            updatedByName: updatedByUser?.username?.value || "N/A",
            createdAt: incident.createdAt,
            updatedAt: incident.updatedAt
          };

          return enrichedIncident;
        } catch (error) {
          console.error(`Erreur lors de l'enrichissement de l'incident ${incident.id}:`, error);
          return {
            id: incident.id,
            reference: incident.reference.value || "",
            description: incident.description.value || "",
            status: incident.status.value || "opened",
            date: typeof incident.date === 'object' && incident.date.value 
              ? new Date(incident.date.value).toISOString() 
              : new Date(incident.date).toISOString(),
            motorcycleLicensePlate: "Moto inconnue",
            createdByName: "Inconnu",
            updatedByName: "N/A",
            createdAt: incident.createdAt,
            updatedAt: incident.updatedAt
          };
        }
      })
    );

    return enrichedIncidents;
  } catch (error) {
    console.error("Erreur dans getIncidents:", error);
    if (axios.isAxiosError(error)) {
      throw error.response?.data?.message || "Erreur lors de la récupération des incidents.";
    }
    throw "Erreur lors de la récupération des incidents.";
  }
};

export const getIncidentById = async (id: string): Promise<Incident | null> => {
  try {
    const response = await api.get<ApiIncident>(`/incidents/${id}`);

    const createdByUser = await getUserById(response.data.createdBy);
    const updatedByUser = response.data.updatedBy ? await getUserById(response.data.updatedBy) : null;
    const motorcycle = await getMotorcycleById(response.data.motorcycleId);

    const incidentDateStr = response.data.date.value;
    const formattedIncidentDate = incidentDateStr ? 
      isValid(parseISO(incidentDateStr)) ? 
        format(parseISO(incidentDateStr), "dd/MM/yyyy HH:mm") : 
        "Date invalide" : 
        "Non spécifiée";

    return {
      id: response.data.id,
      reference: response.data.reference.value,
      description: response.data.description.value,
      status: response.data.status.value,
      date: formattedIncidentDate,
      motorcycleLicensePlate: motorcycle?.brand || "Moto inconnue",
      createdByName: createdByUser?.username.value || "Inconnu",
      updatedByName: updatedByUser?.username.value || "N/A",
      createdAt: new Date(response.data.createdAt).toLocaleString(),
      updatedAt: new Date(response.data.updatedAt).toLocaleString()
    };
  } catch {
    return null;
  }
};
export const createIncident = async (
  incidentData: Omit<ApiIncident, "id" | "createdBy" | "updatedBy" | "createdAt" | "updatedAt">,
  token: string
): Promise<void> => {
  try {
    await api.post("/incidents", incidentData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    throw error.response?.data?.message || "Erreur lors de la création de l'incident.";
  }
};

export const updateIncident = async (
  id: string,
  incidentData: Partial<Omit<ApiIncident, "id" | "createdBy" | "updatedBy" | "createdAt" | "updatedAt">>,
  token: string
): Promise<void> => {
  try {
    await api.put(`/incidents/${id}`, incidentData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    throw error.response?.data?.message || "Erreur lors de la mise à jour de l'incident.";
  }
};

export const deleteIncident = async (id: string, token: string): Promise<void> => {
  try {
    await api.delete(`/incidents/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    throw error.response?.data?.message || "Erreur lors de la suppression de l'incident.";
  }
};


export default api;
