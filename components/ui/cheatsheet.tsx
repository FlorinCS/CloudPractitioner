"use client";

import React, { useEffect, useState } from "react";

type Category = "General" | "Security" | "Billing" | "Support";

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
  Billing: "💰 Billing & Pricing",
  Support: "🧰 Support & Resources",
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
];

export default function Cheatsheet() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [search, setSearch] = useState("");

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
      Billing: [],
      Support: [],
    }
  );

  const filteredKeywords = keywordExplanations.filter((k) =>
    (k.term + k.definition).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-8 text-center">📚 AWS Cheatsheet</h1>

      <div className="mb-8">
        <input
          type="text"
          placeholder="🔍 Search questions, answers, or terms..."
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-green-700">
          🔑 Key Terms Explained
        </h2>
        {filteredKeywords.length > 0 ? (
          <ul className="space-y-3 text-gray-800">
            {filteredKeywords.map((item, idx) => (
              <li
                key={idx}
                className="bg-gray-50 border-l-4 border-green-400 pl-4 p-2 rounded"
              >
                <span className="font-bold text-green-800">{item.term}:</span>{" "}
                {item.definition}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No terms matched your search.</p>
        )}
      </section>
      <hr className="my-10 border-t-2 border-gray-200" />

      {Object.entries(grouped).map(([category, cards]) =>
        cards.length > 0 ? (
          <div key={category} className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">
              {categoryTitles[category as Category]}
            </h2>
            <ul className="space-y-4 text-gray-800">
              {cards.map((card) => (
                <li key={card.id} className="border-l-4 border-blue-400 pl-4">
                  <p className="font-medium">Q: {card.question}</p>
                  <p className="text-gray-700">A: {card.answer}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null
      )}
    </div>
  );
}
