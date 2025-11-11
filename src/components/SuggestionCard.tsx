import { Campaign, Suggestion } from "@/lib/types";
import { useEffect, useState } from "react";
import { fetchCampaignById } from "@/lib/api";

export const SuggestionCard = ({
  suggestion,
  onClone,
}: {
  suggestion: Suggestion;
  onClone: (campaign: Campaign) => void;
}) => {
  const typeColors = {
    creative: "bg-purple-100 text-purple-800",
    targeting: "bg-blue-100 text-blue-800",
    budget: "bg-orange-100 text-orange-800",
    audience: "bg-green-100 text-green-800",
  };

  const [campaign, setCampaign] = useState<Campaign>();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [campaignData] = await Promise.all([
          fetchCampaignById(suggestion.campaignId!),
        ]);
        setCampaign(campaignData!);
      } catch (error) {
        console.log("test");
      } finally {
        console.log("test");
      }
    };
    loadData();
  }, [suggestion?.campaignId]);

  return (
    <div
      key={suggestion.id}
      className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span
          className={`inline-block px-2 py-0.5 rounded text-xs font-semibold capitalize ${
            typeColors[suggestion.type] as any
          }`}
        >
          {suggestion.type}
        </span>
      </div>
      <p className="text-sm font-medium text-foreground mb-1">
        {suggestion.title}
      </p>
      <p className="text-xs text-muted-foreground mb-2">{suggestion.reason}</p>
      <p className="text-xs text-muted-foreground">
        Impressions: {suggestion.impressions.toLocaleString()}
      </p>
      {campaign && (
        <CampaignCard key={campaign.id} campaign={campaign} onClone={onClone} />
      )}
    </div>
  );
};

interface CampaignRowProps {
  campaign: Campaign;
  onClone: (campaign: Campaign) => void;
}
interface CampaignCardProps {
  campaign: Campaign;
  onClone: (campaign: Campaign) => void;
}

function CampaignCard({ campaign, onClone }: CampaignCardProps) {
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

  const roi =
    campaign.spent > 0
      ? ((campaign.conversions * 50) / campaign.spent).toFixed(2)
      : "0";

  return (
    <div className="mt-10 border border-border rounded-lg p-4 mb-4 bg-card shadow-sm hover:shadow-md transition-shadow">
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
          <p>{roi}x</p>
        </div>
        <div>
          <p className="font-medium">Conversions</p>
          <p>{campaign.conversions}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onClone(campaign)}
          className="px-3 py-1 text-sm font-medium rounded bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
        >
          Clone
        </button>
        {/* Có thể thêm button Edit, Delete nếu muốn */}
      </div>
    </div>
  );
}
