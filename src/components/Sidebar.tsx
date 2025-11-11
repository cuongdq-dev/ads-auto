"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface SidebarProps {}

export const navItems = [
  { id: "", label: "Dashboard", icon: "📊" },
  {
    id: "campaigns",
    label: "Campaigns",
    icon: "📢",
  },
  {
    id: "suggestions",
    label: "Suggestions",
    icon: "💡",
  },
  {
    id: "activity",
    label: "Activity",
    icon: "📋",
  },
  {
    id: "settings",
    label: "Settings",
    icon: "⚙️",
  },
];

export function Sidebar({}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = pathname.split("/");

  const onTabChange = useCallback(
    (slug: string) => {
      window.history.pushState(undefined, "", `/${slug}`);
    },
    [router]
  );
  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 md:hidden p-2 rounded-lg bg-primary text-white hover:bg-primary/90"
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      <aside
        className={`fixed md:relative z-40 w-64 h-screen border-r border-sidebar-border bg-sidebar flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold text-sm">
            FB
          </div>
          <p className="mt-2 text-xs text-sidebar-foreground font-medium">
            Facebook Ads
          </p>
          <p className="text-xs text-sidebar-foreground/60">
            Automation Studio
          </p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab[1] == item.id;
            return (
              <Link
                href={item.id}
                key={item.id}
                aria-current={isActive ? "page" : undefined}
                className={`w-full text-left px-4 py-3 rounded-md font-medium transition-all flex items-center gap-3 ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
                onClick={() => {
                  onTabChange(item.id);
                  setIsOpen(false);
                }}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4 space-y-3">
          <div className="px-4 py-3 rounded-md bg-sidebar-accent/50">
            <p className="text-xs font-semibold text-sidebar-foreground mb-1">
              Token Status
            </p>
            <p className="text-xs text-sidebar-foreground/60">
              Expires in 7 days
            </p>
          </div>
          <button className="w-full text-left text-xs text-sidebar-foreground hover:text-sidebar-primary transition-colors px-4 py-2">
            → Need help?
          </button>
        </div>
      </aside>
    </>
  );
}
