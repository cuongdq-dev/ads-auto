"use client";

import { CampaignList } from "@/components/CampaignList";
import { CloneCampaignModal } from "@/components/CloneCampaignModal";
import { CreateCampaignModal } from "@/components/CreateCampaignModal";
import { useToast } from "@/components/ToastProvider";
import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import useUpdateUrl from "@/hooks/use-url";
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
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState<Campaign | undefined>();
  const { addToast } = useToast();

  const { setQueryParam } = useUpdateUrl();

  const searchParams = useSearchParams();
  const tabValue = searchParams?.get("tab") || "dashboard";

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
      <Tabs
        value={tabValue}
        onValueChange={(value) => setQueryParam("tab", value)}
        className="h-full flex flex-col"
      >
        <div className="border-b p-2 px-2 md:px-6 bg-card/50 backdrop-blur-sm">
          <TabsList className="bg-transparent h-12 gap-1">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground  transition-all"
            >
              Campaigns
            </TabsTrigger>
            <TabsTrigger
              value="chat"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground  transition-all"
            >
              Ad sets
            </TabsTrigger>
            <TabsTrigger
              value="expenses"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground  transition-all"
            >
              Ads
            </TabsTrigger>
          </TabsList>
        </div>

        <div>
          <div className="flex flex-col md:flex-row items-start md:items-center  gap-4 mt-2 mb-5">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto px-4 py-2 rounded font-medium hover:bg-primary/50 transition-colors"
            >
              + Create
            </Button>

            <Button
              variant="outline"
              className="w-full md:w-auto px-4 py-2 rounded font-medium hover:bg-primary/90 transition-colors"
            >
              Duplicate
            </Button>

            <Button
              variant="outline"
              className="w-full md:w-auto px-4 py-2 rounded font-medium hover:bg-primary/90 transition-colors"
            >
              Edit
            </Button>
          </div>

          <TabsContent value="dashboard" className="flex-1 m-0 overflow-hidden">
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
          </TabsContent>

          <TabsContent value="chat" className="flex-1 m-0 overflow-hidden">
            slls
          </TabsContent>

          <TabsContent value="expenses" className="flex-1 m-0 overflow-hidden">
            skssk
          </TabsContent>
        </div>
      </Tabs>

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
