"use client";

import { useState } from "react";
import type { TokenStatus as TokenStatusType } from "@/lib/types";
import { refreshToken } from "@/lib/api";
import { useToast } from "./ToastProvider";

interface TokenStatusProps {
  status: TokenStatusType;
}

export function TokenStatus({ status }: TokenStatusProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { addToast } = useToast();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshToken();
      addToast("Token refreshed successfully", "success");
    } catch (error) {
      addToast("Failed to refresh token", "error");
    } finally {
      setIsRefreshing(false);
    }
  };

  const statusColors = {
    valid: "text-green-600",
    "expiring-soon": "text-yellow-600",
    expired: "text-red-600",
  };

  const expiresDate = new Date(status?.expiresAt);
  const daysRemaining = Math.ceil(
    (expiresDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="font-semibold text-foreground mb-3">Token Status</h3>
      <div className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Status</p>
          <p className={`text-sm font-medium ${statusColors[status?.status]}`}>
            {status?.status?.charAt(0).toUpperCase() +
              status?.status?.slice(1).replace("-", " ")}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Expires in</p>
          <p className="text-sm font-medium text-foreground">
            {daysRemaining} days
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Last synced</p>
          <p className="text-sm font-medium text-foreground">
            {new Date(status?.lastSync).toLocaleString()}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="w-full mt-2 px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {isRefreshing ? "Refreshing..." : "Refresh Token"}
        </button>
      </div>
    </div>
  );
}
