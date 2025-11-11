"use client";
import type { Campaign } from "@/lib/types";
import Link from "next/link";
import { Button } from "./ui";

interface CampaignRowProps {
  campaign: Campaign;
  index: number;
  onEdit: (campaign: Campaign) => void;
  onClone: (campaign: Campaign) => void;
  onToggleStatus: (campaign: Campaign) => void;
  onDelete: (id: string) => void;
}

export function CampaignRow({
  campaign,
  index,
  onEdit,
  onToggleStatus,
  onDelete,
  onClone,
}: CampaignRowProps) {
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
    <tr className="border-b border-border hover:bg-card/50 transition-colors">
      <td className="px-0 py-0 text-sm text-foreground capitalize text-center">
        {index + 1}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {/* <span className="text-lg">{objectiveEmojis[campaign.objective]}</span> */}
          <div>
            <Link href={`/campaigns/${campaign.id}`}>
              <p className="font-medium text-foreground">{campaign.name}</p>
            </Link>
            {/* <p className="text-sm text-muted-foreground">ID: {campaign.id}</p> */}
            <p className="text-sm text-muted-foreground">
              Time: {new Date(campaign.createdAt!).toLocaleString()}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-foreground capitalize">
        {campaign.objective}
      </td>
      <td className="px-6 py-4 text-sm text-foreground">
        ${campaign.budget.toLocaleString()}
      </td>
      <td className="px-6 py-4 text-sm text-foreground">
        {campaign.impressions.toLocaleString()}
      </td>
      <td className="px-6 py-4 text-sm text-foreground">{roi}x</td>
      <td className="px-6 py-4">
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            statusColors[campaign.status]
          }`}
        >
          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
        </span>
      </td>
      <td className="px-6 items-center py-4">
        <div className="flex items-center justify-center gap-2">
          <Button
            onClick={() => onToggleStatus(campaign)}
            className="px-2 py-1 text-xs w-15 font-medium rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
            aria-label={`${
              campaign.status === "active" ? "Pause" : "Resume"
            } campaign ${campaign.name}`}
          >
            {campaign.status === "active" ? "Pause" : "Resume"}
          </Button>
          <Button
            onClick={() => onEdit(campaign)}
            className="px-2 py-1 text-xs w-15 font-medium rounded bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
            aria-label={`Edit campaign ${campaign.name}`}
          >
            Edit
          </Button>
          <Button
            onClick={() => onDelete(campaign.id)}
            className="px-2 py-1 text-xs w-15 font-medium rounded bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
            aria-label={`Delete campaign ${campaign.name}`}
          >
            Delete
          </Button>

          <Button
            onClick={() => onClone(campaign)}
            className="px-2 py-1 text-xs w-15 font-medium rounded bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
            aria-label={`Clone campaign ${campaign.name}`}
          >
            Clone
          </Button>
        </div>
      </td>
    </tr>
  );
}
