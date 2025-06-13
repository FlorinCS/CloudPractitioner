"use client";

import { useEffect, use, useState } from "react";
import UserDashboard from "@/components/ui/dashboard";
import { useUser } from "@/lib/auth";

export default function Dashboard() {
  const { userPromise } = useUser();
  const user = use(userPromise);
  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-base font-medium mb-6">Dashboard</h1>
      <UserDashboard user={user} />
    </section>
  );
}
