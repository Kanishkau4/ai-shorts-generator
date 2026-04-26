"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function DashboardPage() {
  const { user } = useUser();
  const supabase = createClient();

  useEffect(() => {
    const syncUser = async () => {
      if (!user) return;

      const { error } = await supabase.from("users").upsert({
        id: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: user.fullName,
        updated_at: new Date().toISOString(),
      });

      if (error) console.error("Error syncing user:", error);
      else console.log("User synced to Supabase!");
    };

    syncUser();
  }, [user, supabase]);

  return (
    <div className="p-8 pt-24">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p>Welcome, {user?.firstName}!</p>
      {/* ... your dashboard content */}
    </div>
  );
}
