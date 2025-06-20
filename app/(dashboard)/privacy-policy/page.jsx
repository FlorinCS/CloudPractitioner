import Head from "next/head";
import Footer from "@/components/ui/Footer";

export default function PrivacyPolicy() {
  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <title>Privacy Policy | CloudPractitioner</title>
        <meta
          name="description"
          content="Learn how we collect, use, and protect your personal data on the CloudPractitioner platform."
        />
        <meta name="robots" content="index, follow" />
        <meta
          name="keywords"
          content="Cloud Practitioner, AWS certification, privacy, personal data, GDPR, CloudPractitioner"
        />
        <meta name="author" content="CloudPractitioner" />
        <link
          rel="canonical"
          href="https://www.cloudpractitioner.io/privacy-policy"
        />
      </Head>

      {/* Page content */}
      <div className="relative isolate overflow-hidden bg-white px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-3xl text-gray-900">
          <h1 className="text-3xl font-bold mb-6">
            Privacy Policy – CloudPractitioner
          </h1>
          <p className="mb-4">Last updated: June 15, 2025</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">1. Introduction</h2>
          <p className="mb-4">
            Your privacy is important to us. This policy explains how
            CloudPractitioner collects, uses, and protects your personal
            information when you use our platform to prepare for the AWS Cloud
            Practitioner certification.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">
            2. Information We Collect
          </h2>
          <ul className="list-disc pl-6 mb-4">
            <li>Name and email address (when signing up or subscribing)</li>
            <li>
              Usage data (practice exams, flashcards, scores, and progress)
            </li>
            <li>Technical data (IP address, browser type, device, OS)</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">
            3. How We Use Your Data
          </h2>
          <ul className="list-disc pl-6 mb-4">
            <li>To personalize your learning experience</li>
            <li>To track your progress and offer performance insights</li>
            <li>To send important updates or announcements</li>
            <li>To ensure platform security and legal compliance</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">
            4. Data Storage & Security
          </h2>
          <p className="mb-4">
            Your data is securely stored on GDPR-compliant servers. We use
            encryption and industry-standard security practices to prevent
            unauthorized access or data breaches.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">5. Your Rights</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>Right to access your personal data</li>
            <li>Right to request correction or deletion</li>
            <li>Right to withdraw consent at any time</li>
            <li>Right to lodge a complaint with a data protection authority</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">6. Cookies</h2>
          <p className="mb-4">
            We use cookies to improve your experience and analyze usage. You can
            choose to disable cookies in your browser settings, though some
            features may be affected.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">7. Policy Updates</h2>
          <p className="mb-4">
            We may update this policy from time to time. Major changes will be
            communicated via email or in-app notifications.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">8. Contact</h2>
          <p className="mb-4">
            If you have any questions or concerns about this policy, feel free
            to contact us at: <strong>contact@cloud-practitioner.com</strong>
          </p>
        </div>
      </div>
    </>
  );
}
