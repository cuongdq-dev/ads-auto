"use client";

import { useState } from "react";
import type { Suggestion } from "@/lib/types";

interface SuggestionPanelProps {
  suggestions: Suggestion[];
}

export function SuggestionPanel({ suggestions }: SuggestionPanelProps) {
  const [minImpressions, setMinImpressions] = useState(0);

  const filteredSuggestions = suggestions.filter(
    (s) => s.impressions >= minImpressions
  );

  return (
    <div className="rounded-lg border border-border bg-card p-6 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="font-semibold text-foreground mb-3">Top Creatives</h3>
        <div>
          <label className="text-xs text-muted-foreground block mb-2">
            Min Impressions: {minImpressions}
          </label>
          <input
            type="range"
            min="0"
            max="500000"
            step="50000"
            value={minImpressions}
            onChange={(e) => setMinImpressions(Number(e.target.value))}
            className="w-full cursor-pointer"
            aria-label="Filter suggestions by minimum impressions"
          />
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {filteredSuggestions.length > 0 ? (
          filteredSuggestions.map((suggestion) => {
            return <SuggestionCard suggestion={suggestion} />;
          })
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No suggestions match your filters
          </p>
        )}
      </div>
    </div>
  );
}

const SuggestionCard = ({ suggestion }: { suggestion: Suggestion }) => {
  const typeColors = {
    creative: "bg-purple-100 text-purple-800",
    targeting: "bg-blue-100 text-blue-800",
    budget: "bg-orange-100 text-orange-800",
    audience: "bg-green-100 text-green-800",
  };
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
    </div>
  );
};
