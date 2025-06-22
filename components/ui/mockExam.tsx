"use client";

import { useState, use, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/lib/auth";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

// Updated question type
type Question = {
  _id: string;
  question: string;
  options: string[];
  correctIndexes: number[]; // array now
  explanation: string;
  category: string;
  difficulty: string;
};

function UpgradeModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-lg space-y-4">
          <div className="flex justify-between items-start">
            <Dialog.Title className="text-xl font-semibold text-gray-900">
              Upgrade to Pro ✨
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-500 hover:text-gray-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="text-base text-gray-600 space-y-2">
            <p>
              Unlock full access to all questions, advanced features, and future
              updates with a single one-time payment.
            </p>
            <p>
              ✅ 350+ Practice Questions
              <br />
              ✅ Unlimited cloud practitioner exams
              <br />
              ✅ 150+ Flashcards
              <br />
              ✅ Full Cheatsheets Access
              <br />✅ Premium support
            </p>
            <p className="text-lg font-bold text-yellow-700">
              Only €5 — one-time payment
            </p>
          </div>

          <div className="pt-2">
            <a
              href="/payment"
              className="block text-center bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-md font-medium"
            >
              Go Pro Now
            </a>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default function MockExam() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number[]>
  >({});
  const [showResults, setShowResults] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(65);
  const [secondsLeft, setSecondsLeft] = useState(5400);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [noTries, setNoTries] = useState(false);
  const { userPromise } = useUser();
  const user = use(userPromise);

  useEffect(() => {
    const fetchQuestions = async (isExam = false) => {
      try {
        const res = await fetch("/api/getQuestions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isExam }),
        });

        if (!res.ok) throw new Error("Failed to fetch questions");

        const data: Question[] = await res.json();
        setQuestions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchQuestions(true);
    }
  }, [user]);

  useEffect(() => {
    if (!showResults || !user?.id || questions.length === 0) return;

    const payload = {
      user_id: user.id,
      score: getScore(),
      total_questions: 65,
      duration_seconds: 5400 - secondsLeft,
      answers: questions.map((q, i) => {
        const selected = selectedAnswers[i] || [];
        const correct = q.correctIndexes;
        const isCorrect =
          selected.length === correct.length &&
          selected.every((ans) => correct.includes(ans));
        return {
          question_id: q._id,
          question: q.question,
          options: q.options,
          correct_indexes: correct,
          selected_indexes: selected,
          is_correct: isCorrect,
        };
      }),
    };

    const sendResults = async () => {
      try {
        const res = await fetch("/api/saveExams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to save results");
      } catch (error) {
        console.error("❌ Error saving results:", error);
      }
    };

    sendResults();
  }, [showResults]);

  const updateTries = async () => {
    try {
      const res = await fetch("/api/updateTries", { method: "POST" });
      if (!res.ok) throw new Error("Failed to reset tries");
      const data = await res.json();
    } catch (error) {
      console.error("❌ Error resetting tries:", error);
    }
  };

  const startExam = async () => {
    if (user?.role === "basic" && (user?.tries === 0 || noTries)) {
      setShowUpgradeModal(true);
      return;
    }

    if (user?.role === "basic" && user?.tries === 1) {
      setNoTries(true);
      if (typeof user.tries !== "undefined") user.tries = 0;
      await updateTries();
    }

    setStarted(false);
    const categories = [
      "Cloud Concepts",
      "Security and Compliance",
      "Technology",
      "Billing and Pricing",
    ];

    const byCategory: Record<string, Question[]> = {};
    for (const q of questions) {
      if (!byCategory[q.category]) byCategory[q.category] = [];
      byCategory[q.category].push(q);
    }

    const selected: Question[] = [];
    for (const category of categories) {
      const qs = byCategory[category] || [];
      if (qs.length > 0) {
        const rand = qs[Math.floor(Math.random() * qs.length)];
        selected.push(rand);
      }
    }

    const remaining = questions.filter((q) => !selected.includes(q));
    const randomFill = remaining
      .sort(() => 0.5 - Math.random())
      .slice(0, totalQuestions - selected.length);
    const finalSet = [...selected, ...randomFill].sort(
      () => 0.5 - Math.random()
    );

    setQuestions(finalSet);
    setShowResults(false);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setSecondsLeft(5400); // full 10 mins

    setTimeout(() => {
      setStarted(true);
    }, 0);
  };

  useEffect(() => {
    if (!started) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowResults(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started]);

  const toggleSelect = (optionIndex: number) => {
    const current = selectedAnswers[currentIndex] || [];
    const alreadySelected = current.includes(optionIndex);

    if (alreadySelected) {
      setSelectedAnswers({
        ...selectedAnswers,
        [currentIndex]: current.filter((i) => i !== optionIndex),
      });
    } else if (current.length < 2) {
      setSelectedAnswers({
        ...selectedAnswers,
        [currentIndex]: [...current, optionIndex],
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const getScore = () => {
    return questions.reduce((score, q, i) => {
      const selected = selectedAnswers[i] || [];
      const correct = q.correctIndexes;
      const isCorrect =
        selected.length === correct.length &&
        selected.every((ans) => correct.includes(ans));
      return isCorrect ? score + 1 : score;
    }, 0);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? "0" + sec : sec}`;
  };

  return (
    <div className="max-w-3xl space-y-6">
      <UpgradeModal open={showUpgradeModal} setOpen={setShowUpgradeModal} />

      {!started ? (
        <motion.div
          className="space-y-4 border rounded-xl p-6 shadow-lg bg-background"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl font-bold">Start Mock Exam</h2>
          <p className="text-lg text-gray-700">
            AWS Certified Cloud Practitioner
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800 text-sm pb-3">
            <div>
              <p className="font-semibold">Category</p>
              <p>Foundational</p>
            </div>
            <div>
              <p className="font-semibold">Exam Duration</p>
              <p>90 minutes</p>
            </div>
            <div>
              <p className="font-semibold">Exam Format</p>
              <p>65 questions; either multiple choice or multiple response</p>
            </div>
          </div>
          <Button
            className="cursor-pointer mt-4 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700"
            onClick={startExam}
          >
            🚀 Start Exam
          </Button>
        </motion.div>
      ) : !showResults && questions.length > 0 ? (
        <>
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="font-semibold text-orange-600">
              Time Left: {formatTime(secondsLeft)}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-md">
                <CardContent className="space-y-6 p-6">
                  <h2 className="text-lg font-semibold">
                    {questions[currentIndex].question}
                  </h2>
                  <div className="grid grid-cols-1 gap-3">
                    {questions[currentIndex].options.map((option, i) => {
                      const selected = selectedAnswers[currentIndex] || [];
                      const isSelected = selected.includes(i);
                      return (
                        <Button
                          key={i}
                          variant={isSelected ? "default" : "outline"}
                          onClick={() => toggleSelect(i)}
                          className="justify-start"
                        >
                          {option}
                        </Button>
                      );
                    })}
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={handleNext}
                      disabled={
                        (selectedAnswers[currentIndex] || []).length === 0
                      }
                    >
                      {currentIndex === questions.length - 1
                        ? "Submit Exam"
                        : "Next"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </>
      ) : showResults ? (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Results</h2>
          <p className="text-muted-foreground text-lg">
            You scored {getScore()} / {questions.length}
          </p>
          {questions.map((q, idx) => {
            const selected = selectedAnswers[idx] || [];
            const isCorrect =
              selected.length === q.correctIndexes.length &&
              selected.every((s) => q.correctIndexes.includes(s));

            return (
              <Card
                key={q._id}
                className={`border-l-4 ${
                  isCorrect ? "border-green-500" : "border-red-500"
                } shadow-sm`}
              >
                <CardContent className="p-4">
                  <p className="font-semibold">
                    Q{idx + 1}: {q.question}
                  </p>
                  <p className="text-sm mt-2">
                    Your answer:{" "}
                    <strong>
                      {selected.length > 0
                        ? selected.map((i) => q.options[i]).join(", ")
                        : "None"}
                    </strong>
                    {!isCorrect &&
                      ` ❌ (Correct: ${q.correctIndexes
                        .map((i) => q.options[i])
                        .join(", ")})`}
                  </p>
                  <p className="text-muted-foreground text-sm mt-1 italic">
                    {q.explanation}
                  </p>
                </CardContent>
              </Card>
            );
          })}
          <div className="pt-4">
            <Button
              className="cursor-pointer px-6 py-2 text-white font-bold bg-black hover:bg-primary/90"
              onClick={startExam}
            >
              📝 Try Again
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
