"use client"

import { useState } from "react"
import type { Campaign } from "@/lib/types"
import { CampaignRow } from "./CampaignRow"

interface CampaignListProps {
  campaigns: Campaign[]
  onEdit: (campaign: Campaign) => void
  onToggleStatus: (campaign: Campaign) => void
  onDelete: (id: string) => void
  isLoading: boolean
}

export function CampaignList({ campaigns, onEdit, onToggleStatus, onDelete, isLoading }: CampaignListProps) {
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "paused" | "ended">("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading campaigns...</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Campaigns</h2>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Search campaigns by name"
          />
          <div className="flex gap-2">
            {(["all", "active", "paused", "ended"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                  statusFilter === status
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-6 py-3 text-left font-semibold text-foreground">Campaign Name</th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Objective</th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Budget</th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Impressions</th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">ROI</th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCampaigns.length > 0 ? (
              filteredCampaigns.map((campaign) => (
                <CampaignRow
                  key={campaign.id}
                  campaign={campaign}
                  onEdit={onEdit}
                  onToggleStatus={onToggleStatus}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                  No campaigns found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
