import { CheckIcon } from "@heroicons/react/20/solid";

const tiers = [
  {
    name: "Starter",
    id: "tier-starter",
    href: "/sign-up",
    priceMonthly: "$0",
    description:
      "Perfect if you want to explore the platform and get a feel for how it works.",
    features: [
      "20 free practice questions",
      "Access to 1 practice exam",
      "20 free flashcards",
      "No progress tracking",
    ],
    type: "Free",
    button: "Get started for free",
    featured: false,
  },
  {
    name: "Pro",
    id: "tier-pro",
    href: "/sign-up",
    priceMonthly: "$5",
    description:
      "Lifetime access to all features to help you become an AWS Cloud Practitioner.",
    features: [
      "350+ practice questions",
      "Unlimited practice exams",
      "150+ AWS flashcards",
      "Progress tracking",
      "Free lifetime updates",
    ],
    type: "One-time payment",
    button: "Upgrade & ace the exam",
    featured: true,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function PricingPlans() {
  return (
    <div className="relative isolate bg-gray-50 px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-base font-semibold text-[#0073BB]">Pricing</h2>
        <p className="mt-2 text-5xl font-semibold tracking-tight text-[#232F3E] sm:text-6xl">
          One-time payment
          <br />
          Full access
          <br />
          <span className="text-[#FF9900]">Lifetime</span>
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-[#4B5563] sm:text-xl">
        Pay once and unlock all premium features forever — including unlimited
        exams, AI-powered flashcards, progress tracking, and more. No monthly
        fees. No subscriptions.
      </p>

      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {tiers.map((tier, tierIdx) => (
          <div
            key={tier.id}
            className={classNames(
              tier.featured
                ? "relative bg-[#232F3E] shadow-2xl"
                : "bg-white sm:mx-8 lg:mx-0",
              tier.featured
                ? ""
                : tierIdx === 0
                ? "rounded-t-3xl sm:rounded-b-none lg:rounded-bl-3xl lg:rounded-tr-none"
                : "sm:rounded-t-none lg:rounded-bl-none lg:rounded-tr-3xl",
              "rounded-3xl p-8 ring-1 ring-gray-300 sm:p-10"
            )}
          >
            <h3
              id={tier.id}
              className={classNames(
                tier.featured ? "text-[#FF9900]" : "text-[#0073BB]",
                "text-base font-semibold"
              )}
            >
              {tier.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span
                className={classNames(
                  tier.featured ? "text-white" : "text-[#232F3E]",
                  "text-5xl font-semibold tracking-tight"
                )}
              >
                {tier.priceMonthly}
              </span>
              <span
                className={classNames(
                  tier.featured ? "text-gray-400" : "text-gray-500",
                  "text-base"
                )}
              >
                / {tier.type}
              </span>
            </p>
            <p
              className={classNames(
                tier.featured ? "text-gray-300" : "text-gray-600",
                "mt-6 text-base"
              )}
            >
              {tier.description}
            </p>
            <ul
              role="list"
              className={classNames(
                tier.featured ? "text-gray-300" : "text-gray-600",
                "mt-8 space-y-3 text-sm sm:mt-10"
              )}
            >
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    aria-hidden="true"
                    className={classNames(
                      tier.featured ? "text-[#FF9900]" : "text-[#0073BB]",
                      "h-6 w-5 flex-none"
                    )}
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href={tier.href}
              aria-describedby={tier.id}
              className={classNames(
                tier.featured
                  ? "bg-[#FF9900] text-[#232F3E] shadow-sm hover:bg-[#e08500] focus-visible:outline-[#FF9900]"
                  : "text-[#0073BB] ring-1 ring-inset ring-[#0073BB] hover:bg-[#E5F3FF] focus-visible:outline-[#0073BB]",
                "mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10"
              )}
            >
              {tier.button}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
