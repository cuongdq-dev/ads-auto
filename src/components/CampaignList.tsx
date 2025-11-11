"use client";

import type { Campaign } from "@/lib/types";
import { useMemo, useState } from "react";
import { CampaignRow } from "./CampaignRow";

interface CampaignListProps {
  campaigns: Campaign[];
  onEdit: (campaign: Campaign) => void;
  onClone: (campaign: Campaign) => void;
  onToggleStatus: (campaign: Campaign) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

type DatePreset = "all" | "1" | "3" | "7" | "14";

export function CampaignList({
  campaigns,
  onEdit,
  onToggleStatus,
  onClone,
  onDelete,
  isLoading,
}: CampaignListProps) {
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "paused" | "ended"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [datePreset, setDatePreset] = useState<DatePreset>("all");
  const [minBudget, setMinBudget] = useState<number | "">("");
  const [maxBudget, setMaxBudget] = useState<number | "">("");
  const [isFilterOpen, setIsFilterOpen] = useState(false); // <-- dropdown toggle

  const createdWithinDays = (campaign: Campaign, days: number) => {
    if (!campaign?.createdAt) return false;
    const created =
      campaign.createdAt instanceof Date
        ? campaign.createdAt
        : new Date(campaign.createdAt);
    if (Number.isNaN(created.getTime())) return false;
    const now = Date.now();
    const msPerDay = 24 * 60 * 60 * 1000;
    return now - created.getTime() <= days * msPerDay;
  };

  const filteredCampaigns = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return campaigns.filter((campaign) => {
      const matchesStatus =
        statusFilter === "all" || campaign.status === statusFilter;
      const matchesSearch =
        q === "" ? true : campaign.name.toLowerCase().includes(q);

      let matchesDate = true;
      if (datePreset !== "all") {
        matchesDate = createdWithinDays(campaign, Number(datePreset));
      }

      const matchesMinBudget =
        minBudget === "" ? true : campaign.budget >= Number(minBudget);
      const matchesMaxBudget =
        maxBudget === "" ? true : campaign.budget <= Number(maxBudget);

      return (
        matchesStatus &&
        matchesSearch &&
        matchesDate &&
        matchesMinBudget &&
        matchesMaxBudget
      );
    });
  }, [campaigns, statusFilter, searchQuery, datePreset, minBudget, maxBudget]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading campaigns...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <input
          type="text"
          placeholder="Search campaigns..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {/* Filter button */}
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="px-3 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            Filter
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-md shadow-lg p-4 z-50">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value as typeof statusFilter)
                    }
                    className="w-full px-2 py-1 border border-input rounded-md bg-background text-foreground"
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="ended">Ended</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Date
                  </label>
                  <select
                    value={datePreset}
                    onChange={(e) =>
                      setDatePreset(e.target.value as DatePreset)
                    }
                    className="w-full px-2 py-1 border border-input rounded-md bg-background text-foreground"
                  >
                    <option value="all">All dates</option>
                    <option value="1">Last 1 day</option>
                    <option value="3">Last 3 days</option>
                    <option value="7">Last 7 days</option>
                    <option value="14">Last 14 days</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Min Budget
                    </label>
                    <input
                      type="number"
                      value={minBudget}
                      onChange={(e) =>
                        setMinBudget(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      className="w-full px-2 py-1 border border-input rounded-md bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Max Budget
                    </label>
                    <input
                      type="number"
                      value={maxBudget}
                      onChange={(e) =>
                        setMaxBudget(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      className="w-full px-2 py-1 border border-input rounded-md bg-background text-foreground"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full px-3 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-3 py-0 text-center font-semibold text-foreground">
                STT
              </th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">
                Campaign Name
              </th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">
                Objective
              </th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">
                Budget
              </th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">
                Impressions
              </th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">
                ROI
              </th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">
                Status
              </th>
              <th className="px-6 py-3 text-center font-semibold text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCampaigns.length > 0 ? (
              filteredCampaigns.map((campaign, index) => (
                <CampaignRow
                  index={index}
                  key={campaign.id}
                  campaign={campaign}
                  onEdit={onEdit}
                  onToggleStatus={onToggleStatus}
                  onDelete={onDelete}
                  onClone={onClone}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-8 text-center text-muted-foreground"
                >
                  No campaigns found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
