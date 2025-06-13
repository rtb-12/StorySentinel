import axios from "axios";
import type { AxiosResponse } from "axios";

// API client configuration
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Generic API response type
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// IP Assets API
export const ipAssetsApi = {
  getAll: (params?: any): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.get("/ip-assets", { params }),

  getById: (id: string): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.get(`/ip-assets/${id}`),

  create: (data: any): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.post("/ip-assets", data),

  update: (id: string, data: any): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.put(`/ip-assets/${id}`, data),

  delete: (id: string): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.delete(`/ip-assets/${id}`),

  register: (id: string, data: any): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.post(`/ip-assets/${id}/register`, data),

  scan: (id: string): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.post(`/ip-assets/${id}/scan`),
};

// Alerts API
export const alertsApi = {
  getAll: (params?: any): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.get("/alerts", { params }),

  getById: (id: string): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.get(`/alerts/${id}`),

  create: (data: any): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.post("/alerts", data),

  update: (id: string, data: any): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.put(`/alerts/${id}`, data),

  delete: (id: string): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.delete(`/alerts/${id}`),

  markAsRead: (ids: string[]): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.post("/alerts/mark-read", { alertIds: ids }),

  escalate: (id: string, data: any): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.post(`/alerts/${id}/escalate`, data),
};

// Disputes API
export const disputesApi = {
  getAll: (params?: any): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.get("/disputes", { params }),

  getById: (id: string): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.get(`/disputes/${id}`),

  create: (data: any): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.post("/disputes", data),

  update: (id: string, data: any): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.put(`/disputes/${id}`, data),

  delete: (id: string): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.delete(`/disputes/${id}`),

  submitToStory: (
    id: string,
    data: any
  ): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.post(`/disputes/${id}/submit-story`, data),

  addEvidence: (
    id: string,
    data: any
  ): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.post(`/disputes/${id}/evidence`, data),
};

// Analytics API
export const analyticsApi = {
  getOverview: (): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.get("/analytics/overview"),

  getAssets: (params?: any): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.get("/analytics/assets", { params }),

  getAlerts: (params?: any): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.get("/analytics/alerts", { params }),

  getDisputes: (params?: any): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.get("/analytics/disputes", { params }),

  getFinancial: (params?: any): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.get("/analytics/financial", { params }),
};

// Yakoa API
export const yakoaApi = {
  search: (data: any): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.post("/yakoa/search", data),

  analyze: (data: any): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.post("/yakoa/analyze", data),

  getMonitoringStatus: (
    assetId: string
  ): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.get(`/yakoa/monitoring/${assetId}`),

  startMonitoring: (data: any): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.post("/yakoa/monitoring/start", data),

  stopMonitoring: (data: any): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.post("/yakoa/monitoring/stop", data),

  updateMonitoring: (
    assetId: string,
    data: any
  ): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.put(`/yakoa/monitoring/${assetId}`, data),

  getDetections: (
    assetId: string,
    params?: any
  ): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.get(`/yakoa/detections/${assetId}`, { params }),

  verifyInfringement: (data: any): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.post("/yakoa/verify", data),

  getPlatforms: (): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.get("/yakoa/platforms"),
};

// Story Protocol API
export const storyApi = {
  register: (data: any): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.post("/story/register", data),

  getAsset: (ipId: string): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.get(`/story/asset/${ipId}`),

  createLicense: (data: any): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.post("/story/license/create", data),

  getLicenses: (ipId: string): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.get(`/story/asset/${ipId}/licenses`),

  submitDispute: (data: any): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.post("/story/dispute/submit", data),

  getDispute: (disputeId: string): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.get(`/story/dispute/${disputeId}`),

  getRoyalties: (ipId: string): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.get(`/story/asset/${ipId}/royalties`),

  collectRoyalties: (data: any): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.post("/story/royalties/collect", data),

  getDerivatives: (ipId: string): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.get(`/story/asset/${ipId}/derivatives`),

  createDerivative: (data: any): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.post("/story/derivative/create", data),

  getIPGraph: (
    ipId: string,
    params?: any
  ): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.get(`/story/graph/${ipId}`, { params }),

  getUserAssets: (
    walletAddress: string,
    params?: any
  ): Promise<AxiosResponse<ApiResponse<any>>> =>
    apiClient.get(`/story/user/${walletAddress}/assets`, { params }),
};

export default apiClient;
