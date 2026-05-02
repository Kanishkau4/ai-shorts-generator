"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Video,
  BookOpen,
  CreditCard,
  Settings,
  Plus,
  Zap,
  User,
  Menu,
  X,
  Sun,
  Moon
} from "lucide-react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { createClient } from "@/utils/supabase/client";
import { UpgradeDialog } from "@/components/billing/UpgradeDialog";

const sidebarLinks = [
  { name: "Series", href: "/dashboard", icon: LayoutDashboard },
  { name: "Videos", href: "/dashboard/videos", icon: Video },
  { name: "Guides", href: "/dashboard/guides", icon: BookOpen },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

const footerLinks = [
  { name: "Upgrade", href: "/dashboard/upgrade", icon: Zap },
  { name: "Profile Settings", href: "/dashboard/profile", icon: User },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { user } = useUser();
  const { has } = useAuth();
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);
  const [isCheckingLimit, setIsCheckingLimit] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleCreateNewSeries = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!user) return;

    // Check if user has Pro feature via Clerk Entitlements
    // 'feature:unlimited-series' is an example permission you might set in Clerk
    const hasUnlimitedAccess = has?.({ permission: "feature:unlimited-series" });
    
    if (hasUnlimitedAccess) {
      router.push("/dashboard/create");
      return;
    }

    // Fallback: Check Supabase for series count if no Clerk entitlement is found
    try {
      setIsCheckingLimit(true);
      const { count, error } = await supabase
        .from("video_series")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id);

      if (error) throw error;

      // Free plan limit: 1 series
      if (count && count >= 1) {
        setIsUpgradeDialogOpen(true);
      } else {
        router.push("/dashboard/create");
      }
    } catch (error) {
      console.error("Error checking series limit:", error);
      // If error, allow creation to not block user, or show dialog as safe default
      router.push("/dashboard/create");
    } finally {
      setIsCheckingLimit(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="md:hidden p-2 -ml-2 text-foreground"
            >
              {isMobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link href="/" className="text-xl font-bold tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-background rounded-sm rotate-45" />
              </div>
              <span className="hidden sm:block">Vibio</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground hidden sm:block">
              Welcome, {user?.firstName}!
            </p>
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full bg-muted/50 border border-border/50 hover:bg-muted transition-all text-foreground hover:scale-110 active:scale-95"
                aria-label="Toggle dark mode"
              >
                {theme === "dark" ? (
                  <Sun size={18} className="text-yellow-400" />
                ) : (
                  <Moon size={18} className="text-slate-700" />
                )}
              </button>
            )}
            <UserButton />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Desktop */}
        <aside className="hidden md:flex w-64 flex-col border-r border-border/40 bg-background/50">
          <div className="p-4">
            <button
              onClick={handleCreateNewSeries}
              disabled={isCheckingLimit}
              className="w-full flex items-center justify-center gap-2 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 py-2.5 px-4 rounded-xl font-medium transition-all active:scale-[0.98]"
            >
              {isCheckingLimit ? (
                <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
              ) : (
                <Plus size={18} />
              )}
              Create New Series
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-2">
            <nav className="grid gap-1 px-3">
              {sidebarLinks.map((link) => {
                const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/dashboard');
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }`}
                  >
                    <Icon size={18} />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-border/40">
            <nav className="grid gap-1">
              {footerLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }`}
                  >
                    <Icon size={18} />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {isMobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-30 flex">
            <div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-border/40 bg-background shadow-2xl animate-in slide-in-from-left-full duration-300 flex flex-col">
              <div className="p-4 mt-16">
                <button
                  onClick={(e) => {
                    setIsMobileSidebarOpen(false);
                    handleCreateNewSeries(e);
                  }}
                  disabled={isCheckingLimit}
                  className="w-full flex items-center justify-center gap-2 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 py-2.5 px-4 rounded-xl font-medium transition-all active:scale-[0.98]"
                >
                  {isCheckingLimit ? (
                    <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  ) : (
                    <Plus size={18} />
                  )}
                  Create New Series
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-2">
                <nav className="grid gap-1 px-3">
                  {sidebarLinks.map((link) => {
                    const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/dashboard');
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsMobileSidebarOpen(false)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                          }`}
                      >
                        <Icon size={18} />
                        {link.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="p-4 border-t border-border/40 bg-background">
                <nav className="grid gap-1">
                  {footerLinks.map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsMobileSidebarOpen(false)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                          }`}
                      >
                        <Icon size={18} />
                        {link.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>

      <UpgradeDialog 
        isOpen={isUpgradeDialogOpen} 
        onOpenChange={setIsUpgradeDialogOpen} 
      />
    </div>
  );
}
