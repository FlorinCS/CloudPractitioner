import {
  CpuChipIcon,
  BookOpenIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import Image from "next/image";
import logo from "@/assets/landingPage/Features4.png"; // Replace when image is ready

const features = [
  {
    name: "200+ Curated Flashcards",
    description:
      "Memorize essential AWS concepts across billing, security, cloud tech, and support — all exam-aligned.",
    icon: CpuChipIcon,
  },
  {
    name: "Random Mode",
    description:
      "Boost memory with randomized flashcards from across all domains — ideal for active recall training.",
    icon: Squares2X2Icon,
  },
  {
    name: "Structured by Exam Domain",
    description:
      "Cards are organized by the four official AWS Certified Cloud Practitioner domains for focused review.",
    icon: BookOpenIcon,
  },
];

export default function Features4() {
  return (
    <div className="overflow-hidden bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:grid-cols-2 lg:items-start">
          <div className="px-6 lg:px-0 lg:pr-4 lg:pt-4">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg">
              <h2 className="text-base font-semibold text-[#FF9900]">
                Learn Smarter
              </h2>
              <p className="mt-2 text-4xl font-bold tracking-tight text-[#232F3E] sm:text-5xl">
                Master AWS Concepts with 200+ Flashcards
              </p>
              <p className="mt-6 text-lg text-gray-600">
                Reinforce your knowledge with curated flashcards tailored to the
                AWS Cloud Practitioner exam. Review content by topic or
                challenge yourself with random questions to prepare efficiently.
              </p>

              <dl className="mt-10 max-w-xl space-y-8 text-base text-gray-600 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <feature.icon
                        aria-hidden="true"
                        className="absolute left-1 top-1 h-5 w-5 text-[#FF9900]"
                      />
                      {feature.name}
                    </dt>{" "}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="sm:px-6 lg:px-0">
            <div className="relative isolate overflow-hidden bg-[#FF9900] px-6 pt-8 sm:mx-auto sm:max-w-2xl sm:rounded-3xl sm:pl-16 sm:pr-0 sm:pt-16 lg:mx-0 lg:max-w-none">
              <div
                aria-hidden="true"
                className="absolute -inset-y-px -left-3 -z-10 w-full origin-bottom-left skew-x-[-30deg] bg-orange-100 opacity-20 ring-1 ring-inset ring-white"
              />
              <div className="mx-auto max-w-2xl sm:mx-0 sm:max-w-none">
                <Image
                  src={logo}
                  alt="Flash Cards Screenshot"
                  width={432}
                  height={42}
                  className=" w-[28rem] max-w-none rounded-xl bg-gray-800 ring-1 ring-white/10"
                />
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10 sm:rounded-3xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
