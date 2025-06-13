// app/payment-success/page.tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount");

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-500 to-purple-600 p-6">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl p-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          Thank You for Your Purchase! 🎉
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Your payment was successful. You’ve unlocked{" "}
          <strong>Pro Access</strong> and now have full access to all features!
        </p>

        <div className="text-5xl font-bold text-purple-600 mb-6">
          {amount ? `$${amount}` : "Payment Completed"}
        </div>

        <Link
          href="/dashboard"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-200"
        >
          Go to Dashboard
        </Link>
      </div>
    </main>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
