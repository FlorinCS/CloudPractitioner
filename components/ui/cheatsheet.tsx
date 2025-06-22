"use client";

import React, { useEffect, use, useState } from "react";
import { useUser } from "@/lib/auth";

type Category = "General" | "Security" | "Services" | "Pricing";

type Flashcard = {
  id: number;
  question: string;
  answer: string;
  category: Category;
};

type Keyword = {
  term: string;
  definition: string;
};

const categoryTitles: Record<Category, string> = {
  General: "📘 Cloud Concepts",
  Security: "🔐 Security & Compliance",
  Services: "🧰 Services",
  Pricing: "💰 Pricing",
};

const keywordExplanations: Keyword[] = [
  {
    term: "Region",
    definition:
      "A geographical area with multiple Availability Zones for deploying AWS resources.",
  },
  {
    term: "Availability Zone",
    definition:
      "A data center (or group of data centers) in a region that are isolated from failures.",
  },
  {
    term: "IAM",
    definition:
      "Identity and Access Management — used to manage users, permissions, and roles.",
  },
  {
    term: "EC2",
    definition:
      "Elastic Compute Cloud — a service that provides resizable compute capacity.",
  },
  {
    term: "S3",
    definition:
      "Simple Storage Service — object storage used for storing and retrieving any amount of data.",
  },
  {
    term: "CloudFront",
    definition:
      "A content delivery network (CDN) that delivers content with low latency.",
  },
  {
    term: "Auto Scaling",
    definition:
      "Automatically adjusts compute capacity to maintain performance and reduce cost.",
  },
  {
    term: "VPC",
    definition:
      "Virtual Private Cloud — a logically isolated section of the AWS cloud where you can launch AWS resources in a virtual network that you define.",
  },
  {
    term: "Subnet",
    definition:
      "A range of IP addresses in your VPC. Subnets can be public or private.",
  },
  {
    term: "Route Table",
    definition:
      "A set of rules, called routes, that are used to determine where network traffic is directed.",
  },
  {
    term: "Security Group",
    definition:
      "A virtual firewall that controls the traffic allowed in and out of an EC2 instance.",
  },
  {
    term: "EBS",
    definition:
      "Elastic Block Storage — provides block-level storage volumes for use with EC2 instances.",
  },
  {
    term: "RDS",
    definition:
      "Relational Database Service — a managed database service for MySQL, PostgreSQL, Oracle, SQL Server, and MariaDB.",
  },
  {
    term: "DynamoDB",
    definition:
      "A fully managed NoSQL database service that provides fast and predictable performance with seamless scalability.",
  },
  {
    term: "Lambda",
    definition:
      "A serverless compute service that lets you run code without provisioning or managing servers.",
  },
  {
    term: "API Gateway",
    definition:
      "A fully managed service that makes it easy for developers to create, publish, maintain, monitor, and secure APIs at any scale.",
  },
  {
    term: "CloudWatch",
    definition:
      "A monitoring and observability service that provides data and actionable insights to monitor your applications, respond to system-wide performance changes, and optimize resource utilization.",
  },
  {
    term: "CloudFormation",
    definition:
      "A service that helps you model and set up your AWS resources so you can spend less time managing those resources and more time focusing on your applications.",
  },
  {
    term: "SQS",
    definition:
      "Simple Queue Service — a fully managed message queuing service that enables you to decouple and scale microservices, distributed systems, and serverless applications.",
  },
  {
    term: "SNS",
    definition:
      "Simple Notification Service — a fully managed messaging service for decoupling microservices, distributed systems, and serverless applications.",
  },
  {
    term: "ECS",
    definition:
      "Elastic Container Service — a fully managed container orchestration service that makes it easy to deploy, manage, and scale containerized applications.",
  },
  {
    term: "EKS",
    definition:
      "Elastic Kubernetes Service — a managed Kubernetes service that makes it easy to run Kubernetes on AWS without needing to install, operate, and maintain your own Kubernetes control plane.",
  },
  {
    term: "ELB",
    definition:
      "Elastic Load Balancing — automatically distributes incoming application traffic across multiple targets, such as EC2 instances, containers, and IP addresses.",
  },
  {
    term: "ALB",
    definition:
      "Application Load Balancer — A type of ELB that makes intelligent routing decisions at the application layer (HTTP/HTTPS).",
  },
  {
    term: "NLB",
    definition:
      "Network Load Balancer — A type of ELB that is best suited for load balancing of Transmission Control Protocol (TCP), User Datagram Protocol (UDP) and Transport Layer Security (TLS) traffic where extreme performance is required.",
  },
  {
    term: "ASG",
    definition:
      "Auto Scaling Group - A collection of EC2 instances that are treated as a logical unit for the purposes of automatic scaling and management.",
  },
  {
    term: "IAM Role",
    definition:
      "An IAM entity that defines a set of permissions for making AWS service requests.",
  },
  {
    term: "Key Pair",
    definition:
      "A set of security credentials that you use to prove your identity when connecting to an EC2 instance.",
  },
  {
    term: "Instance",
    definition: "A virtual server in the AWS cloud.",
  },
  {
    term: "Instance Type",
    definition:
      "The configuration of the hardware for your virtual machine, including the CPU, memory, storage and networking capacity.",
  },
  {
    term: "AMI",
    definition:
      "Amazon Machine Image — provides the information required to launch an instance, which is a virtual server in the cloud.",
  },
  {
    term: "Serverless",
    definition:
      "A cloud computing execution model in which the cloud provider dynamically manages the allocation of machine resources. Services like AWS Lambda are serverless.",
  },
  {
    term: "Container",
    definition:
      "A standard unit of software that packages up code and all its dependencies so the application runs quickly and reliably from one computing environment to another. Docker is a popular containerization technology.",
  },
];

export default function Cheatsheet() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [search, setSearch] = useState("");
  const { userPromise } = useUser();
  const user = use(userPromise);
  const userRole = user?.role ?? "basic";

  useEffect(() => {
    const fetchFlashcards = async () => {
      const res = await fetch("/api/getFlashcards");
      const data = await res.json();
      setFlashcards(data);
    };
    fetchFlashcards();
  }, []);

  const filteredFlashcards = flashcards.filter((card) =>
    (card.question + card.answer + card.category)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const grouped = filteredFlashcards.reduce<Record<Category, Flashcard[]>>(
    (acc, card) => {
      acc[card.category] = acc[card.category] || [];
      acc[card.category].push(card);
      return acc;
    },
    {
      General: [],
      Security: [],
      Services: [],
      Pricing: [],
    }
  );

  const filteredKeywords = keywordExplanations.filter((k) =>
    (k.term + k.definition).toLowerCase().includes(search.toLowerCase())
  );

  const visibleKeywords =
    userRole === "pro" ? filteredKeywords : filteredKeywords.slice(0, 3);
  const hasHiddenKeywords = userRole !== "pro" && filteredKeywords.length > 3;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-8 text-center">📚 AWS Cheatsheet</h1>

      <input
        type="text"
        placeholder="🔍 Search questions, answers, or terms..."
        className="w-full mb-10 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Key Terms */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-green-700">
          🔑 Key Terms Explained
        </h2>

        {visibleKeywords.length > 0 ? (
          <ul className="space-y-3 text-gray-800">
            {visibleKeywords.map((item, idx) => (
              <li
                key={idx}
                className="bg-white/30 backdrop-blur-md border-l-4 border-green-500 pl-4 py-2 px-2 rounded-md shadow-sm"
              >
                <span className="font-bold text-green-800">{item.term}:</span>{" "}
                {item.definition}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No terms matched your search.</p>
        )}

        {hasHiddenKeywords && (
          <div className="mt-4 text-center">
            <a
              href="/payment"
              className="block sm:inline bg-yellow-400 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-500 transition shadow"
            >
              🔓 Unlock all {filteredKeywords.length} key terms with Pro (5$)
            </a>
          </div>
        )}
      </section>

      <hr className="my-10 border-t-2 border-gray-300" />

      {/* Flashcards */}
      {Object.entries(grouped).map(([category, cards]) => {
        if (cards.length === 0) return null;

        const visibleCards = userRole === "pro" ? cards : cards.slice(0, 3);
        const hasHiddenCards = userRole !== "pro" && cards.length > 3;

        return (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">
              {categoryTitles[category as Category]}
            </h2>
            <ul className="space-y-4 text-gray-800">
              {visibleCards.map((card) => (
                <li
                  key={card.id}
                  className="bg-white/30 backdrop-blur-md border-l-4 border-blue-400 pl-4 py-3 px-3 rounded-md shadow"
                >
                  <p className="font-medium">Q: {card.question}</p>
                  <p className="text-gray-700">A: {card.answer}</p>
                </li>
              ))}
            </ul>

            {hasHiddenCards && (
              <div className="mt-4 text-center">
                <a
                  href="/payment"
                  className="block sm:inline cursor-pointer bg-yellow-400 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-500 transition shadow"
                >
                  🔓 Unlock rest of the flashcards with Pro (5$)
                </a>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
