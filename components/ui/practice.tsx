"use client";

import { useState, use, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "@/lib/auth";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
}

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function PracticeExam() {
  const [categoryFilter, setCategoryFilter] = useState<string | "all">("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string | "all">(
    "all"
  );
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const { userPromise } = useUser();
  const user = use(userPromise);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/getQuestions", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch questions");
        }

        const data: Question[] = await res.json();
        setQuestions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchQuestions();
    }
  }, [user]);

  const filteredQuestions = useMemo(
    () =>
      questions.filter(
        (q) =>
          (categoryFilter === "all" || q.category === categoryFilter) &&
          (difficultyFilter === "all" || q.difficulty === difficultyFilter)
      ),
    [questions, categoryFilter, difficultyFilter]
  );

  const shuffled = useMemo(
    () => shuffleArray(filteredQuestions),
    [filteredQuestions]
  );
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setAnswers(Array(shuffled.length).fill(null));
    setCurrent(0);
    setSubmitted(false);
  }, [shuffled]);

  if (loading) {
    return <p>Loading questions...</p>;
  }

  if (shuffled.length === 0) {
    return <p>No questions available for the selected filters.</p>;
  }

  const currentQuestion = shuffled[current];

  const handleSelect = (index: number) => {
    if (!submitted) {
      const newAnswers = [...answers];
      newAnswers[current] = index;
      setAnswers(newAnswers);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const progress = ((current + 1) / shuffled.length) * 100;

  const uniqueCategories = [
    "all",
    ...Array.from(new Set(questions.map((q) => q.category))),
  ];
  const uniqueDifficulties = [
    "all",
    ...Array.from(new Set(questions.map((q) => q.difficulty))),
  ];

  return (
    <div className="max-w-3xl space-y-6">
      {!submitted ? (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <select
              className="border rounded-md p-2"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>

            <select
              className="border rounded-md p-2"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              {uniqueDifficulties.map((dif) => (
                <option key={dif} value={dif}>
                  {dif === "all" ? "All Difficulties" : dif}
                </option>
              ))}
            </select>
          </div>

          {/* Question Card */}
          <motion.div
            className="shadow-lg rounded-2xl border border-gray-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>
                    Question <strong>{current + 1}</strong> / {shuffled.length}
                  </span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-sm text-gray-500">
                  <span className="mr-4">
                    Category: {currentQuestion.category}
                  </span>
                  <span className="capitalize">
                    Difficulty: {currentQuestion.difficulty}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {currentQuestion.question}
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {currentQuestion.options.map((opt, idx) => (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: 0.97 }}
                      className={`w-full px-4 py-3 border rounded-xl text-left transition-colors duration-200 font-medium ${
                        answers[current] === idx
                          ? idx === currentQuestion.correctIndex
                            ? "bg-green-100 border-green-500 text-green-800"
                            : "bg-red-100 border-red-500 text-red-800"
                          : "hover:bg-gray-50 border-gray-300"
                      }`}
                      onClick={() => handleSelect(idx)}
                    >
                      {opt}
                    </motion.button>
                  ))}
                </div>
                <div className="flex justify-between pt-6">
                  <Button
                    variant="secondary"
                    onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                    disabled={current === 0}
                  >
                    Previous
                  </Button>
                  {current < shuffled.length - 1 ? (
                    <Button onClick={() => setCurrent((c) => c + 1)}>
                      Next
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Submit Exam
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      ) : (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {shuffled.map((q, i) => (
            <Card
              key={q.id}
              className={`border-l-4 ${
                answers[i] === q.correctIndex
                  ? "border-green-500"
                  : "border-red-500"
              } shadow-sm`}
            >
              <CardContent className="p-5 space-y-3">
                <div className="text-sm text-gray-400">
                  Category: {q.category} · Difficulty: {q.difficulty}
                </div>
                <p className="font-semibold text-lg text-gray-800">
                  {q.question}
                </p>
                <div className="space-y-1">
                  {q.options.map((opt, idx) => {
                    const isCorrect = idx === q.correctIndex;
                    const isSelected = idx === answers[i];
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                          isCorrect
                            ? "bg-green-100 border-green-400 text-green-800"
                            : isSelected && !isCorrect
                            ? "bg-red-100 border-red-400 text-red-800"
                            : "border-gray-200 text-gray-700"
                        }`}
                      >
                        {isCorrect ? (
                          <BadgeCheck size={16} />
                        ) : isSelected && !isCorrect ? (
                          <XCircle size={16} />
                        ) : (
                          <span className="w-4 h-4 inline-block" />
                        )}
                        <span>{opt}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-sm text-gray-500 pt-2">💡 {q.explanation}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}
    </div>
  );
}
