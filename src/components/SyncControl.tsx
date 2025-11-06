"use client"

import { useState } from "react"
import { syncData } from "@/lib/api"
import { useToast } from "./ToastProvider"

export function SyncControl() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSync, setLastSync] = useState(new Date())
  const { addToast } = useToast()

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      await syncData()
      setLastSync(new Date())
      addToast("Sync completed successfully", "success")
    } catch (error) {
      addToast("Sync failed. Please try again.", "error")
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="font-semibold text-foreground mb-3">Data Sync</h3>
      <div className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Last sync</p>
          <p className="text-sm font-medium text-foreground">{lastSync.toLocaleTimeString()}</p>
        </div>
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className={`w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isSyncing
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-accent text-accent-foreground hover:bg-accent/90"
          }`}
        >
          {isSyncing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block animate-spin">⟳</span>
              Syncing...
            </span>
          ) : (
            "Sync Now"
          )}
        </button>
      </div>
    </div>
  )
}
