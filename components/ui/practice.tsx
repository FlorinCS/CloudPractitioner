"use client";

import { useState, use, useEffect } from "react";
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

const LOCAL_STORAGE_KEY = "practice-progress";

export default function PracticeExam() {
  const [categoryFilter, setCategoryFilter] = useState<"all" | string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<"all" | string>(
    "all"
  );
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const { userPromise } = useUser();
  const user = use(userPromise);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/getQuestions");
        if (!res.ok) throw new Error("Failed to fetch questions");
        const data: Question[] = await res.json();
        setQuestions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchQuestions();
    }
  }, [user]);

  // 1. Set filtered questions when filters change
  useEffect(() => {
    const filtered = questions.filter(
      (q) =>
        (categoryFilter === "all" || q.category === categoryFilter) &&
        (difficultyFilter === "all" || q.difficulty === difficultyFilter)
    );
    setFilteredQuestions(filtered);
  }, [questions, categoryFilter, difficultyFilter]);

  // 2. Restore saved progress ONCE when questions are initially fetched
  useEffect(() => {
    if (questions.length === 0) return;

    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as {
          answers: (number | null)[];
          current: number;
          submitted: boolean;
        };

        // Apply only if saved progress matches the questions length
        if (parsed.answers && parsed.answers.length === questions.length) {
          setAnswers(parsed.answers);
          setCurrent(parsed.current < questions.length ? parsed.current : 0);
          setSubmitted(parsed.submitted);
          setHasSavedProgress(true);
          return;
        }
      } catch (e) {
        console.error("Failed to parse saved progress:", e);
      }
    }

    // Default initialization
    setAnswers(Array(questions.length).fill(null));
    setCurrent(0);
    setSubmitted(false);
    setHasSavedProgress(false);
  }, [questions]);

  // Save progress
  useEffect(() => {
    if (filteredQuestions.length > 0) {
      const payload = {
        answers,
        current,
        submitted,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
    }
  }, [answers, current, submitted, filteredQuestions]);

  const handleReset = () => {
    setAnswers(Array(filteredQuestions.length).fill(null));
    setCurrent(0);
    setSubmitted(false);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setHasSavedProgress(false);
  };

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

  const goToFirstUnanswered = () => {
    const firstUnansweredIndex = answers.findIndex((a) => a === null);
    if (firstUnansweredIndex !== -1) {
      setCurrent(firstUnansweredIndex);
    }
  };

  const goToNextUnanswered = () => {
    for (let i = current + 1; i < answers.length; i++) {
      if (answers[i] === null) {
        setCurrent(i);
        return;
      }
    }
    for (let i = 0; i <= current; i++) {
      if (answers[i] === null) {
        setCurrent(i);
        return;
      }
    }
  };

  const currentQuestion = filteredQuestions[current];
  const progress = ((current + 1) / filteredQuestions.length) * 100;

  const uniqueCategories = [
    "all",
    ...Array.from(new Set(questions.map((q) => q.category))),
  ];
  const uniqueDifficulties = [
    "all",
    ...Array.from(new Set(questions.map((q) => q.difficulty))),
  ];

  if (loading) return <p>Loading questions...</p>;
  if (filteredQuestions.length === 0)
    return <p>No questions match the selected filters.</p>;

  return (
    <div className="max-w-3xl space-y-6">
      {!submitted ? (
        <>
          <div className="flex flex-wrap gap-4 items-center">
            <select
              className="border p-2 rounded"
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
              className="border p-2 rounded"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              {uniqueDifficulties.map((dif) => (
                <option key={dif} value={dif}>
                  {dif === "all" ? "All Difficulties" : dif}
                </option>
              ))}
            </select>

            <Button variant="destructive" onClick={handleReset}>
              Start Over
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    Question {current + 1} / {filteredQuestions.length}
                  </span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-indigo-600"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-sm text-gray-500">
                  <span className="mr-4">
                    Category: {currentQuestion.category}
                  </span>
                  <span>Difficulty: {currentQuestion.difficulty}</span>
                </div>
                <h2 className="text-xl font-semibold">
                  {currentQuestion.question}
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {currentQuestion.options.map((opt, idx) => (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: 0.97 }}
                      className={`w-full px-4 py-3 border rounded-xl text-left font-medium transition-colors ${
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
                  {current < filteredQuestions.length - 1 ? (
                    <Button onClick={() => setCurrent((c) => c + 1)}>
                      Next
                    </Button>
                  ) : (
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={handleSubmit}
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
          {filteredQuestions.map((q, i) => (
            <Card
              key={q.id}
              className={`border-l-4 ${
                answers[i] === q.correctIndex
                  ? "border-green-500"
                  : "border-red-500"
              }`}
            >
              <CardContent className="p-5 space-y-3">
                <div className="text-sm text-gray-400">
                  Category: {q.category} · Difficulty: {q.difficulty}
                </div>
                <p className="font-semibold text-lg">{q.question}</p>
                <div className="space-y-1">
                  {q.options.map((opt, idx) => {
                    const isCorrect = idx === q.correctIndex;
                    const isSelected = idx === answers[i];
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 px-4 py-2 rounded border ${
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
                          <span className="w-4 h-4" />
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
