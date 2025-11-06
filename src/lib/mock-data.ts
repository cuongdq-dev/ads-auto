import type { Campaign, Account, Pixel, Suggestion, ActivityLog, TokenStatus } from "./types"

export const mockAccounts: Account[] = [
  { id: "1", name: "Main Account", currency: "USD", status: "connected" },
  { id: "2", name: "Secondary Account", currency: "EUR", status: "connected" },
]

export const mockPixels: Pixel[] = [
  { id: "px1", name: "Main Pixel", accountId: "1", status: "active" },
  { id: "px2", name: "Test Pixel", accountId: "1", status: "active" },
  { id: "px3", name: "Backup Pixel", accountId: "2", status: "inactive" },
]

export const mockCampaigns: Campaign[] = [
  {
    id: "camp1",
    name: "Summer Sale Campaign",
    objective: "conversion",
    status: "active",
    budget: 5000,
    spent: 3245,
    impressions: 125000,
    conversions: 342,
    createdAt: "2025-10-15T10:30:00Z",
    accountId: "1",
    pixelId: "px1",
    automations: ["auto1", "auto3"],
  },
  {
    id: "camp2",
    name: "Brand Awareness Q4",
    objective: "reach",
    status: "active",
    budget: 8000,
    spent: 7200,
    impressions: 450000,
    conversions: 156,
    createdAt: "2025-09-20T14:22:00Z",
    accountId: "1",
    pixelId: "px1",
    automations: ["auto2"],
  },
  {
    id: "camp3",
    name: "Engagement Test",
    objective: "engagement",
    status: "paused",
    budget: 2000,
    spent: 1500,
    impressions: 45000,
    conversions: 89,
    createdAt: "2025-08-10T09:15:00Z",
    accountId: "2",
    pixelId: "px3",
    automations: [],
  },
  {
    id: "camp4",
    name: "Traffic Drive",
    objective: "traffic",
    status: "ended",
    budget: 3500,
    spent: 3500,
    impressions: 98000,
    conversions: 234,
    createdAt: "2025-07-05T11:45:00Z",
    accountId: "1",
    pixelId: "px2",
    automations: ["auto1"],
  },
]

export const mockSuggestions: Suggestion[] = [
  {
    id: "sug1",
    type: "creative",
    title: "High-performing creative variant",
    reason: "CTR 15% higher than baseline",
    impressions: 125000,
    createdAt: "2025-11-03T08:00:00Z",
    campaignId: "camp1",
  },
  {
    id: "sug2",
    type: "targeting",
    title: "Expand to 25-34 age group",
    reason: "ROAS 2.3x in this segment",
    impressions: 98000,
    createdAt: "2025-11-02T15:30:00Z",
    campaignId: "camp1",
  },
  {
    id: "sug3",
    type: "budget",
    title: "Increase daily budget",
    reason: "Learning phase not complete",
    impressions: 45000,
    createdAt: "2025-11-01T10:00:00Z",
    campaignId: "camp2",
  },
  {
    id: "sug4",
    type: "creative",
    title: "Test video creative",
    reason: "Video engagement 3.5x higher",
    impressions: 156000,
    createdAt: "2025-10-30T12:15:00Z",
    campaignId: "camp2",
  },
]

export const mockActivityLogs: ActivityLog[] = [
  {
    id: "log1",
    action: "Campaign created",
    campaignName: "Summer Sale Campaign",
    timestamp: "2025-11-04T16:45:00Z",
    status: "success",
  },
  {
    id: "log2",
    action: "Budget updated",
    campaignName: "Brand Awareness Q4",
    timestamp: "2025-11-04T14:20:00Z",
    status: "success",
  },
  {
    id: "log3",
    action: "Automation paused",
    campaignName: "Summer Sale Campaign",
    timestamp: "2025-11-04T12:10:00Z",
    status: "success",
  },
  {
    id: "log4",
    action: "Sync failed",
    campaignName: "All campaigns",
    timestamp: "2025-11-04T10:00:00Z",
    status: "error",
    details: "API rate limit exceeded",
  },
  {
    id: "log5",
    action: "Campaign paused",
    campaignName: "Engagement Test",
    timestamp: "2025-11-03T09:30:00Z",
    status: "success",
  },
]

export const mockTokenStatus: TokenStatus = {
  token: "token_abc123xyz789",
  expiresAt: "2025-11-15T23:59:59Z",
  status: "valid",
  lastSync: "2025-11-04T17:00:00Z",
}

export const creativeOptions = [
  { id: "cr1", name: "Video - Product Demo" },
  { id: "cr2", name: "Image - Summer Sale Banner" },
  { id: "cr3", name: "Carousel - Multi-product" },
  { id: "cr4", name: "Slideshow - Brand Story" },
]
