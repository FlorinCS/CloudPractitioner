"use client";

import { useEffect, useState } from "react";
import StarRating from "@/components/ui/starRating";

export default function ContactPage() {
  return (
    <main className="bg-gray-50 p-8 flex items-center justify-center">
      <div className="max-w-3xl w-full">
        <h1 className="text-center text-4xl font-semibold mb-6">Contact Us</h1>
        <StarRating />
      </div>
    </main>
  );
}
