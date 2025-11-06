export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export interface Campaign {
  id: string;
  name: string;
  objective: "conversion" | "traffic" | "engagement" | "reach";
  status: "active" | "paused" | "ended";
  budget: number;
  spent: number;
  impressions: number;
  conversions: number;
  createdAt: string;
  accountId: string;
  pixelId: string;
  automations: string[];
}

export interface Account {
  id: string;
  name: string;
  currency: string;
  status: "connected" | "disconnected";
}

export interface Pixel {
  id: string;
  name: string;
  accountId: string;
  status: "active" | "inactive";
}

export interface Suggestion {
  id: string;
  type: "creative" | "targeting" | "budget";
  title: string;
  reason: string;
  impressions: number;
  createdAt: string;
  campaignId?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  campaignName: string;
  timestamp: string;
  status: "success" | "error" | "pending";
  details?: string;
}

export interface TokenStatus {
  token: string;
  expiresAt: string;
  status: "valid" | "expiring-soon" | "expired";
  lastSync: string;
}

export interface CreateCampaignPayload {
  name: string;
  objective: Campaign["objective"];
  accountId: string;
  pixelId: string;
  budget: number;
  dailyBudget: number;
  targeting: {
    ageMin: number;
    ageMax: number;
    locations: string[];
  };
  creative: {
    id: string;
    name: string;
  };
}

export interface Toast {
  id: string;
  type: "success" | "error" | "info";
  message: string;
  duration?: number;
}
