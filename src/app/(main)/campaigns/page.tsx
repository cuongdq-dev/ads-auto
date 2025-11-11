"use client";

import { CampaignList } from "@/components/CampaignList";
import { CloneCampaignModal } from "@/components/CloneCampaignModal";
import { CreateCampaignModal } from "@/components/CreateCampaignModal";
import { useToast } from "@/components/ToastProvider";
import {
  cloneCampaign,
  createCampaign,
  deleteCampaign,
  fetchActivityLogs,
  fetchCampaigns,
  fetchSuggestions,
  updateCampaignStatus,
} from "@/lib/api";
import type { ActivityLog, Campaign, Suggestion } from "@/lib/types";
import { useEffect, useState } from "react";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleCreateCampaign = async (payload: any) => {
    const newCampaign = await createCampaign(payload);
    setCampaigns((prev) => [newCampaign, ...prev]);
    return newCampaign;
  };
  const handleCloneCampaign = async (payload: any) => {
    const newCampaign = await cloneCampaign(payload);
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
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ">
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
        onClone={(campaign) => {
          setIsModalOpen(true);
          setForm(campaign);
        }}
        onEdit={(campaign) => {
          setIsModalOpen(true);
          setForm(campaign);
        }}
        onToggleStatus={handleToggleCampaignStatus}
        onDelete={handleDeleteCampaign}
        isLoading={isLoading}
      />

      <CreateCampaignModal
        isOpen={isModalOpen && !form}
        onClose={() => {
          setIsModalOpen(false);
          setForm(undefined);
        }}
        onCreate={handleCreateCampaign}
      />

      <CloneCampaignModal
        isOpen={isModalOpen && !!form}
        defaultValues={form}
        onClose={() => {
          setIsModalOpen(false);
          setForm(undefined);
        }}
        onClone={handleCloneCampaign}
      />
    </>
  );
}
