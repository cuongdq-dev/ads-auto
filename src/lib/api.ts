import type { Campaign, ActivityLog, Suggestion } from "./types";
import { mockCampaigns, mockActivityLogs, mockSuggestions } from "./mock-data";

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchCampaigns(): Promise<Campaign[]> {
  await delay(500);
  return mockCampaigns;
}

export async function fetchCampaignById(id: string): Promise<Campaign | null> {
  await delay(300);
  return mockCampaigns.find((c) => c.id === id) || null;
}

export async function createCampaign(payload: Campaign): Promise<Campaign> {
  await delay(800);
  const newCampaign: Campaign = {
    id: `camp${Date.now()}`,
    name: payload.name,
    objective: payload.objective,
    status: "active",
    budget: payload.budget,
    spent: 0,
    impressions: 0,
    conversions: 0,
    createdAt: new Date(),
    accountId: payload.accountId,
    pixelId: payload.pixelId,
    automations: [],
  };
  mockCampaigns.push(newCampaign);
  return newCampaign;
}

export async function cloneCampaign(payload: Campaign): Promise<Campaign> {
  await delay(800);
  const newCampaign: Campaign = {
    id: `camp${Date.now()}`,
    name: payload.name,
    objective: payload.objective,
    status: "active",
    budget: payload.budget,
    spent: 0,
    impressions: 0,
    conversions: 0,
    createdAt: new Date(),
    accountId: payload.accountId,
    pixelId: payload.pixelId,
    automations: [],
  };
  mockCampaigns.push(newCampaign);
  return newCampaign;
}

export async function updateCampaignStatus(
  id: string,
  status: "active" | "paused" | "ended"
): Promise<Campaign> {
  await delay(500);
  const campaign = mockCampaigns.find((c) => c.id === id);
  if (campaign) {
    campaign.status = status;
  }
  return campaign!;
}

export async function deleteCampaign(id: string): Promise<boolean> {
  await delay(600);
  const index = mockCampaigns.findIndex((c) => c.id === id);
  if (index > -1) {
    mockCampaigns.splice(index, 1);
    return true;
  }
  return false;
}

export async function fetchActivityLogs(): Promise<ActivityLog[]> {
  await delay(400);
  return mockActivityLogs;
}

export async function fetchSuggestions(): Promise<Suggestion[]> {
  await delay(500);
  return mockSuggestions;
}

export async function syncData(): Promise<{
  success: boolean;
  timestamp: string;
}> {
  await delay(2000);
  return { success: true, timestamp: new Date().toISOString() };
}

export async function refreshToken(): Promise<{
  token: string;
  expiresAt: string;
}> {
  await delay(1000);
  return {
    token: `token_${Date.now()}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
}
