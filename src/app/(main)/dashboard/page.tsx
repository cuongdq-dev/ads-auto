"use client";

import { CampaignList } from "@/components/CampaignList";
import { LogsTable } from "@/components/LogsTable";
import { SuggestionPanel } from "@/components/SuggestionPanel";
import { SyncControl } from "@/components/SyncControl";
import { useToast } from "@/components/ToastProvider";
import { TokenStatus } from "@/components/TokenStatus";
import {
  deleteCampaign,
  fetchActivityLogs,
  fetchCampaigns,
  fetchSuggestions,
  updateCampaignStatus,
} from "@/lib/api";
import { mockTokenStatus } from "@/lib/mock-data";
import type { ActivityLog, Campaign, Suggestion } from "@/lib/types";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [form, setForm] = useState<Campaign | undefined>();
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
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CampaignList
            campaigns={campaigns}
            onClone={(campaign) => {
              setForm(campaign);
            }}
            onEdit={() => {}}
            onToggleStatus={handleToggleCampaignStatus}
            onDelete={handleDeleteCampaign}
            isLoading={isLoading}
          />
          <LogsTable logs={logs} />
        </div>

        <div className="space-y-6">
          <SuggestionPanel suggestions={suggestions} />
          <TokenStatus status={mockTokenStatus as any} />
          <SyncControl />
        </div>
      </div>

      {/* {activeTab === "suggestions" && (
        <div className="p-4 md:p-6 lg:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            Suggestions
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {suggestions.map((suggestion) => {
              return (
                <SuggestionCard
                  suggestion={suggestion}
                  onClone={(campaign) => {
                    setIsModalOpen(true);
                    setForm(campaign);
                  }}
                />
              );
            })}
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
      )} */}
    </div>
  );
}
