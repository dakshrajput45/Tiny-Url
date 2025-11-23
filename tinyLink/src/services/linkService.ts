import axiosInstance from "./api";
import axios from "axios";

interface AddLinkResponse {
  slug: string;
  shortUrl?: string;
  message?: string;
}

interface Link {
  _id: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  analytics: {
    clickCount: number;
    totalUniqueClicks: number;
    lastClickedAt: string | null;
  };
}

export const addLink = async (longUrl: string): Promise<AddLinkResponse> => {
  const res = await axiosInstance.post<AddLinkResponse>("/links", { longUrl });
  return res.data;
};

export const getLink = async (slug: string): Promise<Link> => {
  const res = await axiosInstance.get<Link>(`/links/${slug}`);
  return res.data;
};

export const getAllLinks = async (): Promise<Link[]> => {
  const res = await axiosInstance.get<{ message: string; data: Link[] }>("/links");
  return res.data.data;
};

export const deleteLink = async (slug: string): Promise<void> => {
  await axiosInstance.delete(`/links/${slug}`);
};

export interface HealthData {
  status: string;
  uptime: number;
  timestamp: string;
  database: {
    status: string;
    connected: boolean;
  };
  redis: {
    status: string;
    connected: boolean;
  };
  memory: {
    used: string;
    total: string;
  };
  system: {
    platform: string;
    nodeVersion: string;
  };
}

export const checkHealth = async (): Promise<HealthData> => {
  const res = await axios.get<HealthData>("/healthz");
  return res.data;
}