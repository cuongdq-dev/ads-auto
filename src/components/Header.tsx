"use client"

import type React from "react"
import { useState } from "react"
import { useToast } from "./ToastProvider"

export function Header() {
  const { addToast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      addToast(`Searching for: ${searchQuery}`, "info")
      setSearchQuery("")
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 gap-4">
        <div className="flex items-center gap-2 md:gap-3 flex-1 md:flex-none">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-xs md:text-sm">
            AD
          </div>
          <h1 className="hidden md:block text-lg md:text-xl font-bold text-foreground">AdAutomation</h1>
        </div>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 text-sm border border-input rounded bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="Search campaigns"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Submit search"
            >
              🔍
            </button>
          </div>
        </form>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            className="px-3 md:px-4 py-2 text-xs md:text-sm rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
            onClick={() => addToast("User menu opened", "info")}
            aria-label="User menu"
          >
            👤 <span className="hidden md:inline">Account</span>
          </button>
        </div>
      </div>
    </header>
  )
}
