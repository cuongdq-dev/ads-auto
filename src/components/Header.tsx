"use client";

import { usePathname } from "next/navigation";

const navItems = [
  { id: "", label: "Dashboard", icon: "📊" },
  { id: "campaigns", label: "Campaigns", icon: "📢" },
  { id: "suggestions", label: "Suggestions", icon: "💡" },
  { id: "activity", label: "Activity", icon: "📋" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

export function Header() {
  const pathname = usePathname();
  const activeTab = pathname.split("/")[1];
  const headerTitle = navItems.find((nav) => nav.id == activeTab);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 gap-4">
        <div className="flex items-center gap-2 md:gap-3 flex-1 md:flex-none">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-xs md:text-sm">
            AD
          </div>
          <h1 className="hidden md:block text-lg md:text-xl font-bold text-foreground">
            {headerTitle?.label || "AdAutomation"}
          </h1>
        </div>
      </div>
    </header>
  );
}
