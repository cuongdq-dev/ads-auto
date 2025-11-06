"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { CampaignList } from "@/components/CampaignList";
import { SuggestionPanel } from "@/components/SuggestionPanel";
import { TokenStatus } from "@/components/TokenStatus";
import { SyncControl } from "@/components/SyncControl";
import { LogsTable } from "@/components/LogsTable";
import { CreateCampaignModal } from "@/components/CreateCampaignModal";
import { useToast } from "@/components/ToastProvider";
import type { Campaign, Suggestion, ActivityLog } from "@/lib/types";
import {
  fetchCampaigns,
  fetchSuggestions,
  fetchActivityLogs,
  createCampaign,
  updateCampaignStatus,
  deleteCampaign,
} from "@/lib/api";
import { mockTokenStatus } from "@/lib/mock-data";
import { ToastProvider } from "@/components/ui/";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [campaignData, suggestionData, logData] = await Promise.all([
          fetchCampaigns(),
          fetchSuggestions(),
          fetchActivityLogs(),
        ]);
        setCampaigns(campaignData);
        setSuggestions(suggestionData);
        setLogs(logData);
      } catch (error) {
        addToast("Failed to load data", "error");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [addToast]);

  const handleCreateCampaign = async (payload: any) => {
    const newCampaign = await createCampaign(payload);
    setCampaigns((prev) => [newCampaign, ...prev]);
    return newCampaign;
  };

  const handleToggleCampaignStatus = async (campaign: Campaign) => {
    const newStatus = campaign.status === "active" ? "paused" : "active";
    try {
      const updated = await updateCampaignStatus(campaign.id, newStatus);
      setCampaigns((prev) =>
        prev.map((c) => (c.id === campaign.id ? updated : c))
      );
      addToast(`Campaign ${newStatus}`, "success");
    } catch (error) {
      addToast("Failed to update campaign", "error");
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    try {
      await deleteCampaign(id);
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
      addToast("Campaign deleted", "success");
    } catch (error) {
      addToast("Failed to delete campaign", "error");
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex flex-col flex-1 w-full md:w-auto">
        <Header />
        <main className="flex-1 overflow-auto">
          {activeTab === "dashboard" && (
            <div className="p-4 md:p-6 lg:p-8 space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Dashboard
                </h1>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full md:w-auto px-4 py-2 bg-primary text-primary-foreground rounded font-medium hover:bg-primary/90 transition-colors"
                >
                  + New Campaign
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <CampaignList
                    campaigns={campaigns}
                    onEdit={() => {}}
                    onToggleStatus={handleToggleCampaignStatus}
                    onDelete={handleDeleteCampaign}
                    isLoading={isLoading}
                  />
                  <LogsTable logs={logs} />
                </div>

                <div className="space-y-6">
                  <SuggestionPanel suggestions={suggestions} />
                  <TokenStatus status={mockTokenStatus} />
                  <SyncControl />
                </div>
              </div>
            </div>
          )}

          {activeTab === "campaigns" && (
            <div className="p-4 md:p-6 lg:p-8 space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  All Campaigns
                </h1>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full md:w-auto px-4 py-2 bg-primary text-primary-foreground rounded font-medium hover:bg-primary/90 transition-colors"
                >
                  + New Campaign
                </button>
              </div>
              <CampaignList
                campaigns={campaigns}
                onEdit={() => {}}
                onToggleStatus={handleToggleCampaignStatus}
                onDelete={handleDeleteCampaign}
                isLoading={isLoading}
              />
            </div>
          )}

          {activeTab === "suggestions" && (
            <div className="p-4 md:p-6 lg:p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                Suggestions
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="border border-border rounded-lg p-4 bg-card hover:shadow-lg transition-shadow cursor-pointer hover:bg-card/80"
                  >
                    <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-primary/20 text-primary mb-2 capitalize">
                      {suggestion.type}
                    </span>
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                      {suggestion.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                      {suggestion.reason}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Impressions: {suggestion.impressions.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="p-4 md:p-6 lg:p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                Activity Logs
              </h1>
              <LogsTable logs={logs} />
            </div>
          )}

          {activeTab === "settings" && (
            <div className="p-4 md:p-6 lg:p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                Settings
              </h1>
              <div className="max-w-md rounded-lg border border-border bg-card p-6 space-y-4">
                <h2 className="font-semibold text-foreground">App Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Theme
                    </label>
                    <select className="w-full px-3 py-2 border border-input rounded bg-background text-foreground text-sm">
                      <option>Light</option>
                      <option>Dark</option>
                      <option>Auto</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Notifications
                    </label>
                    <select className="w-full px-3 py-2 border border-input rounded bg-background text-foreground text-sm">
                      <option>All</option>
                      <option>Important only</option>
                      <option>None</option>
                    </select>
                  </div>
                  <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded font-medium hover:bg-primary/90 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <CreateCampaignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateCampaign}
      />
    </div>
  );
}
