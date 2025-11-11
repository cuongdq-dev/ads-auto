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
  createdAt?: Date;
  accountId: string;
  pixelId: string;
  automations: string[];
  // TODO
  saved?: boolean;
  targeting?: {
    ageMin?: number;
    ageMax?: number;
    locations?: string[];
  };
  creative?: {
    id?: string;
    name?: string;
  };

  dailyBudget?: number;
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
  type: "creative" | "targeting" | "budget" | "audience";
  title: string;
  reason: string;
  impressions: number;
  createdAt: Date;

  campaignId?: string;
  priority?: string;
  status?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  campaignName: string;
  timestamp: string;
  status: "success" | "error" | "pending";
  details?: string;
  campaignId?: string;
}

export interface TokenStatus {
  token: string;
  expiresAt: string;
  status: "valid" | "expiring-soon" | "expired";
  lastSync: string;
  accountId: string;
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
