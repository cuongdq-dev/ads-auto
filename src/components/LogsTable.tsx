"use client"

import { useState } from "react"
import type { ActivityLog } from "@/lib/types"

interface LogsTableProps {
  logs: ActivityLog[]
}

export function LogsTable({ logs }: LogsTableProps) {
  const [expandedLog, setExpandedLog] = useState<string | null>(null)

  const statusIcons = {
    success: "✓",
    error: "✕",
    pending: "⟳",
  }

  const statusColors = {
    success: "text-green-600",
    error: "text-red-600",
    pending: "text-yellow-600",
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="border-b border-border p-6">
        <h3 className="font-semibold text-foreground">Activity Logs</h3>
      </div>
      <div className="divide-y divide-border">
        {logs.map((log) => (
          <div key={log.id}>
            <button
              onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
              className="w-full text-left px-6 py-4 hover:bg-muted/50 transition-colors flex items-center justify-between"
              aria-expanded={expandedLog === log.id}
              aria-label={`Log details for ${log.action}`}
            >
              <div className="flex items-center gap-4 flex-1">
                <span className={`text-lg font-semibold ${statusColors[log.status]}`}>{statusIcons[log.status]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{log.action}</p>
                  <p className="text-xs text-muted-foreground">{log.campaignName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</p>
              </div>
              <span className="ml-2">{expandedLog === log.id ? "▼" : "▶"}</span>
            </button>
            {expandedLog === log.id && log.details && (
              <div className="px-6 py-3 bg-muted/30 border-t border-border">
                <p className="text-xs text-muted-foreground">{log.details}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
