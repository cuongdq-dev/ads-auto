"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import useUpdateUrl from "@/hooks/use-url";
import { fetchCampaignById } from "@/lib/api";
import type { Campaign } from "@/lib/types";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DetailPage() {
  const statusColors = {
    active: "bg-green-100 text-green-800",
    paused: "bg-yellow-100 text-yellow-800",
    ended: "bg-gray-100 text-gray-800",
  };
  const objectiveEmojis = {
    conversion: "🎯",
    traffic: "🚀",
    engagement: "💬",
    reach: "📢",
  };

  const [campaign, setCampaign] = useState<Campaign>();

  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [campaignData] = await Promise.all([fetchCampaignById(id!)]);
        setCampaign(campaignData!);
      } catch (error) {
        console.log("test");
      } finally {
        console.log("test");
      }
    };
    loadData();
  }, []);
  const { setQueryParam } = useUpdateUrl();
  const searchParams = useSearchParams();
  const tabValue = searchParams?.get("tab") || "";

  if (!campaign) return <></>;
  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Chi tiết Campaign
        </h1>
        <button className="w-full md:w-auto px-4 py-2 bg-primary text-primary-foreground rounded font-medium hover:bg-primary/90 transition-colors">
          + Clone Campaign
        </button>
      </div>
      <div className="border border-border rounded-lg p-4 mb-4 bg-card shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          {/* Info */}
          <div className="flex gap-3">
            <span className="text-2xl">
              {objectiveEmojis[campaign.objective]}
            </span>
            <div>
              <p className="font-semibold text-foreground text-lg">
                {campaign.name}
              </p>
              <p className="text-sm text-muted-foreground">ID: {campaign.id}</p>
              <p className="text-sm text-muted-foreground">
                Ngày tạo: {new Date(campaign.createdAt!).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Mục tiêu: {campaign.objective}
              </p>
            </div>
          </div>

          {/* Status */}
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              statusColors[campaign.status]
            }`}
          >
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </span>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 text-sm text-foreground">
          <div>
            <p className="font-medium">Ngân sách</p>
            <p>${campaign.budget.toLocaleString()}</p>
          </div>
          <div>
            <p className="font-medium">Impressions</p>
            <p>{campaign.impressions.toLocaleString()}</p>
          </div>
          <div>
            <p className="font-medium">ROI</p>
            {/* <p>{roi}x</p> */}
          </div>
          <div>
            <p className="font-medium">Conversions</p>
            <p>{campaign.conversions}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <button
            //   onClick={() => onClone(campaign)}
            className="px-3 py-1 text-sm font-medium rounded bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
          >
            Clone
          </button>
          {/* Có thể thêm button Edit, Delete nếu muốn */}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs
          value={tabValue}
          onValueChange={(value) => setQueryParam("tab", value)}
          className="h-full flex flex-col"
        >
          <div className="border-b  p-2 px-4 md:px-6 bg-card/50 backdrop-blur-sm">
            <TabsList className="bg-transparent h-12 gap-1">
              <TabsTrigger
                value="adset"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground  transition-all"
              >
                Adset
              </TabsTrigger>
              <TabsTrigger
                value="content"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground  transition-all"
              >
                Content
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="flex-1 m-0 overflow-hidden">
            {/* <DashboardTab /> */}
            {/* TODO LIST ADSET */}
          </TabsContent>

          <TabsContent value="chat" className="flex-1 m-0 overflow-hidden">
            {/* <ChatTab /> */}
            {/* TODO LIST CONTENT */}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
