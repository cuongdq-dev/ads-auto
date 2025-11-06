"use client"
import type { Campaign } from "@/lib/types"

interface CampaignRowProps {
  campaign: Campaign
  onEdit: (campaign: Campaign) => void
  onToggleStatus: (campaign: Campaign) => void
  onDelete: (id: string) => void
}

export function CampaignRow({ campaign, onEdit, onToggleStatus, onDelete }: CampaignRowProps) {
  const statusColors = {
    active: "bg-green-100 text-green-800",
    paused: "bg-yellow-100 text-yellow-800",
    ended: "bg-gray-100 text-gray-800",
  }

  const objectiveEmojis = {
    conversion: "🎯",
    traffic: "🚀",
    engagement: "💬",
    reach: "📢",
  }

  const roi = campaign.spent > 0 ? ((campaign.conversions * 50) / campaign.spent).toFixed(2) : "0"

  return (
    <tr className="border-b border-border hover:bg-card/50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-lg">{objectiveEmojis[campaign.objective]}</span>
          <div>
            <p className="font-medium text-foreground">{campaign.name}</p>
            <p className="text-sm text-muted-foreground">ID: {campaign.id}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-foreground capitalize">{campaign.objective}</td>
      <td className="px-6 py-4 text-sm text-foreground">${campaign.budget.toLocaleString()}</td>
      <td className="px-6 py-4 text-sm text-foreground">{campaign.impressions.toLocaleString()}</td>
      <td className="px-6 py-4 text-sm text-foreground">{roi}x</td>
      <td className="px-6 py-4">
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[campaign.status]}`}
        >
          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(campaign)}
            className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
            aria-label={`Edit campaign ${campaign.name}`}
          >
            Edit
          </button>
          <button
            onClick={() => onToggleStatus(campaign)}
            className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
            aria-label={`${campaign.status === "active" ? "Pause" : "Resume"} campaign ${campaign.name}`}
          >
            {campaign.status === "active" ? "Pause" : "Resume"}
          </button>
          <button
            onClick={() => onDelete(campaign.id)}
            className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
            aria-label={`Delete campaign ${campaign.name}`}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  )
}
