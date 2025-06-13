// ✅ app/flashcards/page.tsx
"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "@/components/ui/CheckoutPage";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import Image from "next/image";
// import logo from "@/assets/logos/Logov1.0.png";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const amount = 5.0;

export default function PlataPage() {
  return (
    <main className="bg-gray-50 min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Benefits */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
            All Features<br></br> One Price<br></br> Lifetime Access
          </h1>
          <p className="text-gray-600 mb-6">
            Make a one-time payment and get full access to everything you need
            to pass the AWS Cloud Practitioner exam with confidence.
          </p>
          <ul className="space-y-3">
            <li className="flex items-center text-gray-700">
              ✅ Access to{" "}
              <strong className="ml-1">500+ practice questions</strong>
            </li>
            <li className="flex items-center text-gray-700">
              ✅ Includes{" "}
              <strong className="ml-1">Unlimited practice exams</strong>
            </li>
            <li className="flex items-center text-gray-700">
              ✅ Unlock <strong className="ml-1">all 200+ flashcards</strong>
            </li>
            <li className="flex items-center text-gray-700">
              ✅ Full access to{" "}
              <strong className="ml-1">all cheatsheet sections</strong>
            </li>
            <li className="flex items-center text-gray-700">
              ✅ <strong className="ml-1">Lifetime access</strong> — no
              subscription!
            </li>
          </ul>
        </div>

        {/* Stripe Checkout */}
        <div className="border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-6">
          <Elements
            stripe={stripePromise}
            options={{
              mode: "payment",
              amount: convertToSubcurrency(amount),
              currency: "usd",
            }}
          >
            <CheckoutPage amount={amount} />
          </Elements>
        </div>
      </div>
    </main>
  );
}
