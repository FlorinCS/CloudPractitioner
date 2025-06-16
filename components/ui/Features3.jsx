import {
  ClipboardDocumentListIcon,
  CheckBadgeIcon,
  ArrowPathIcon,
} from "@heroicons/react/20/solid";
import Image from "next/image";
import logo from "@/assets/landingPage/Features3.png"; // Use your actual image

const features = [
  {
    name: "Unlimited official-style exams",
    description:
      "Generate realistic AWS Cloud Practitioner practice exams anytime, tailored to match the real test structure and question style.",
    icon: ClipboardDocumentListIcon,
  },
  {
    name: "Instant feedback with explanations",
    description:
      "After each attempt, view correct answers and explanations to improve your understanding efficiently.",
    icon: CheckBadgeIcon,
  },
  {
    name: "Detailed exam history",
    description:
      "Track your progress over time with access to past exams, answers, scores, and performance insights.",
    icon: ArrowPathIcon,
  },
];

export default function Features3() {
  return (
    <div className="overflow-hidden bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:ml-auto lg:pl-4 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold text-[#FF9900]">
                Practice like it’s the real exam
              </h2>
              <p className="mt-2 text-4xl font-bold tracking-tight text-[#232F3E] sm:text-5xl">
                Unlimited AWS Cloud Practitioner practice exams
              </p>
              <p className="mt-6 text-lg text-gray-700">
                Our platform gives you endless opportunities to test your
                knowledge with realistic practice exams, mirroring the official
                AWS format. Build exam confidence through repetition and
                detailed insights.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base text-gray-700 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-[#232F3E]">
                      <feature.icon
                        aria-hidden="true"
                        className="absolute left-1 top-1 size-5 text-[#FF9900]"
                      />
                      {feature.name}
                    </dt>{" "}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="flex items-start justify-end lg:order-first">
            <Image
              src={logo}
              alt="CloudPractitioneer Practice Exams Screenshot"
              width={2432}
              height={1442}
              className="-mb-12 w-[40rem] rounded-xl bg-gray-800 ring-1 ring-white/10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
