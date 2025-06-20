import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { getUser, getTeamForUser } from "@/lib/db/queries";
import { UserProvider } from "@/lib/auth";
import { SWRConfig } from "swr";

export const metadata: Metadata = {
  title: "Prepare for the AWS Cloud Practitioner Exam with CloudPractitioner",
  description:
    "Smart platform to generate practice exams, review flashcards, and track your progress for the AWS Certified Cloud Practitioner exam.",
  keywords: [
    "AWS Cloud Practitioner",
    "cloud certification",
    "AWS exam prep",
    "practice tests",
    "aws practice tests",
    "AWS flashcards",
    "Cloud Practitioner",
    "AWS training platform",
  ],
  openGraph: {
    title: "Master the AWS Cloud Practitioner Exam with CloudPractitioneer",
    description:
      "AI-powered platform for AWS Cloud Practitioner practice exams, flashcards, and performance tracking.",
    url: "https://cloud-practitioner.com",
    images: [
      {
        url: "/preview-cloudpractitioneer.jpg", // Ensure this image exists in the /public directory
        width: 1200,
        height: 630,
        alt: "CloudPractitioneer – AWS Cloud Practitioner Prep",
      },
    ],
  },
  metadataBase: new URL("https://cloud-practitioner.com"),
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  maximumScale: 1,
};

const manrope = Manrope({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userPromise = getUser();
  return (
    <html
      lang="en"
      className={`bg-white dark:bg-gray-950 text-black dark:text-white ${manrope.className}`}
    >
      <body className="min-h-[100dvh] bg-gray-50">
        <UserProvider userPromise={userPromise}>{children}</UserProvider>
      </body>
    </html>
  );
}
