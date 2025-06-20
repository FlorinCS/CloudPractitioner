"use client";

import UserDashboard from "@/components/ui/dashboard";

export default function Dashboard() {
  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-base font-medium mb-6">Dashboard</h1>
      <UserDashboard />
    </section>
  );
}
