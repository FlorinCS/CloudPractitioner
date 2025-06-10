"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

type Category = "General" | "Security" | "Billing" | "Support";
type Status = "unseen" | "known" | "review";

type Flashcard = {
  id: number;
  question: string;
  answer: string;
  category: Category;
};

const categories: Category[] = ["General", "Security", "Billing", "Support"];
const progressKey = "flashcard_progress";

export default function Flashcards() {
  const [allFlashcards, setAllFlashcards] = useState<Flashcard[]>([]);
  const [filteredFlashcards, setFilteredFlashcards] = useState<Flashcard[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">(
    "All"
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [progress, setProgress] = useState<Record<number, Status>>({});
  const [randomCard, setRandomCard] = useState<Flashcard | null>(null);

  const currentCard = randomCard ?? filteredFlashcards[currentIndex];

  useEffect(() => {
    const loadFlashcards = async () => {
      try {
        const res = await fetch("/api/getFlashcards");
        const data = await res.json();
        setAllFlashcards(data);
        setFilteredFlashcards(data);
      } catch (error) {
        console.error("Failed to fetch flashcards:", error);
      }
    };

    loadFlashcards();

    const saved = localStorage.getItem(progressKey);
    if (saved) setProgress(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(progressKey, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    const cards =
      selectedCategory === "All"
        ? [...allFlashcards]
        : allFlashcards.filter((c) => c.category === selectedCategory);

    setFilteredFlashcards(cards);
    setCurrentIndex(0);
    setFlipped(false);
    setRandomCard(null);
  }, [selectedCategory, allFlashcards]);

  const handlePrev = () => {
    setFlipped(false);
    setCurrentIndex((prev) =>
      prev === 0 ? filteredFlashcards.length - 1 : prev - 1
    );
    setRandomCard(null);
  };

  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex((prev) =>
      prev === filteredFlashcards.length - 1 ? 0 : prev + 1
    );
    setRandomCard(null);
  };

  const handleRandom = () => {
    const pool =
      filteredFlashcards.length > 0 ? filteredFlashcards : allFlashcards;
    const random = pool[Math.floor(Math.random() * pool.length)];
    setFlipped(false);
    setRandomCard(random);
  };

  const updateProgress = (status: Status) => {
    if (!currentCard) return;
    setProgress((prev) => ({
      ...prev,
      [currentCard.id]: status,
    }));
  };

  const getStatusColor = (id: number) => {
    const status = progress[id];
    if (status === "known") return "bg-green-100 border-green-500";
    if (status === "review") return "bg-yellow-100 border-yellow-500";
    return "bg-white";
  };

  const getStatusLabel = (id: number) => {
    const status = progress[id];
    if (status === "known") return "✅ Known";
    if (status === "review") return "🔁 Review Later";
    return "🕓 Unseen";
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">🧠 Flashcards</h1>

      <div className="mb-4 text-sm text-center text-gray-600">
        {Object.entries(progress).length} reviewed •{" "}
        {Object.values(progress).filter((v) => v === "known").length} known •{" "}
        {Object.values(progress).filter((v) => v === "review").length} review
      </div>

      <div className="mb-6 flex justify-center gap-4 flex-wrap">
        <select
          className="border border-gray-300 px-4 py-2 rounded-md shadow-sm"
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(e.target.value as Category | "All")
          }
        >
          <option value="All">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button
          onClick={handleRandom}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          🎲 Random Card
        </button>
      </div>

      {filteredFlashcards.length === 0 ? (
        <p className="text-center text-gray-500">No flashcards available.</p>
      ) : (
        <>
          <div
            className={clsx(
              "relative h-64 w-full perspective-1000 cursor-pointer mb-6 border rounded-xl shadow-lg transition-all duration-300",
              getStatusColor(currentCard?.id || 0)
            )}
            onClick={() => setFlipped(!flipped)}
          >
            <div
              className={clsx(
                "absolute w-full h-full transition-transform duration-500 transform-style-preserve-3d",
                flipped ? "rotate-y-180" : ""
              )}
            >
              {/* Front */}
              <div className="absolute w-full h-full backface-hidden flex items-center justify-center text-xl font-semibold p-6 text-gray-800">
                {currentCard?.question}
              </div>

              {/* Back */}
              <div className="absolute w-full h-full rotate-y-180 backface-hidden flex items-center justify-center text-xl font-semibold p-6 text-white bg-blue-600">
                {currentCard?.answer}
              </div>
            </div>
          </div>

          <div className="mb-2 text-center text-sm text-gray-500">
            Status:{" "}
            <span className="font-medium">
              {currentCard && getStatusLabel(currentCard.id)}
            </span>
          </div>

          <div className="flex gap-3 justify-center mb-6">
            <button
              onClick={() => updateProgress("known")}
              className="px-4 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200"
            >
              ✅ Mark as Known
            </button>
            <button
              onClick={() => updateProgress("review")}
              className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
            >
              🔁 Review Later
            </button>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handlePrev}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
            >
              ⬅️ Previous
            </button>
            <span className="text-gray-500">
              {currentIndex + 1} / {filteredFlashcards.length}
            </span>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
            >
              Next ➡️
            </button>
          </div>
        </>
      )}
    </div>
  );
}
