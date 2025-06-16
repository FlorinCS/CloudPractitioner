"use client";

import { useState } from "react";
import { Bars3Icon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import logo from "@/assets/logos/CP-Logo2.0.png";
import logoDashboard from "@/assets/landingPage/DashboardLogo.png";
import Features1 from "@/components/ui/Features1";
import Features2 from "@/components/ui/Features2";
import Features3 from "@/components/ui/Features3";
import Features4 from "@/components/ui/Features4";
import Stats from "@/components/ui/stats";
import PricingPlans from "@/components/ui/pricingPlans";
import Testimonials from "@/components/ui/testimonials";

const navigation = [
  { name: "About", href: "#about" },
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "Testimonials", href: "#testimonials" },
];

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="relative isolate overflow-hidden bg-gray-50">
        <nav className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="/" className="-m-1.5 p-1.5">
              <Image src={logo} alt="Logo" width={130} height={35} />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2.5 text-gray-700"
            >
              <span className="sr-only">Open menu</span>
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-semibold text-gray-900 hover:text-orange-600"
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="/sign-in" className="text-sm font-semibold text-gray-900">
              Sign In <span aria-hidden="true">→</span>
            </a>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div className="lg:hidden absolute z-50 w-full bg-white shadow-md px-6 py-6">
            <div className="flex items-center justify-between">
              <Image src={logo} alt="Logo" width={120} height={32} />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 p-2"
              >
                ✕
              </button>
            </div>
            <div className="mt-6 space-y-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block text-base font-medium text-gray-900 hover:text-orange-600"
                >
                  {item.name}
                </a>
              ))}
              <a
                href="/sign-in"
                className="block text-base font-semibold text-gray-900 hover:text-orange-600"
              >
                Sign In →
              </a>
            </div>
          </div>
        )}

        <svg
          className="absolute inset-0 -z-10 h-full w-full stroke-gray-300 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="grid"
              width={200}
              height={200}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" strokeWidth={0} />
        </svg>

        <div className="relative sm:pt-14">
          <div className="sm:py-10 lg:pb-40">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-3xl text-center">
                <div className="mt-24 sm:mt-32 lg:mt-16">
                  <a href="#" className="inline-flex space-x-6">
                    <span className="rounded-full bg-orange-600/10 px-3 py-1 text-sm font-semibold text-orange-600 ring-1 ring-orange-600/20">
                      New!
                    </span>
                    <span className="inline-flex items-center space-x-2 text-sm font-medium text-gray-600">
                      <span>Update 2.5 just launched</span>
                      <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                    </span>
                  </a>
                </div>
                <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-[#232F3E] mt-8">
                  Master the AWS Cloud Practitioner Exam
                </h1>
                <p className="mt-6 text-lg text-gray-600 sm:text-xl">
                  CloudPractitioneer helps you learn faster with smart
                  flashcards, practice exams, and visual progress tracking — all
                  in one place.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <a
                    href="/sign-in"
                    className="rounded-md bg-[#FF9900] px-5 py-3 text-sm font-semibold text-white shadow hover:bg-orange-700 transition"
                  >
                    Start Free
                  </a>
                  <a
                    href="#features"
                    className="text-sm font-semibold text-gray-900 hover:text-orange-600"
                  >
                    Learn More →
                  </a>
                </div>
              </div>

              <div className="mt-20 flow-root sm:mt-24">
                <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-300/20 lg:-m-4 lg:rounded-2xl lg:p-4">
                  {/* Add dashboard screenshot here */}
                  <Image
                    src={logoDashboard}
                    alt="App screenshot"
                    className="rounded-lg shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Future Components */}
        <section id="features">
          <Features1 />
        </section>
        <Features2 />
        <Features3 />
        <Features4 />
        <Stats />
        <section id="pricing">
          <PricingPlans />
        </section>
        <section id="testimonials">
          <Testimonials />
        </section>
      </div>
    </>
  );
}
