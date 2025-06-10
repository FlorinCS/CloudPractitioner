"use client";

import { useState, use, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/lib/auth";

// Define the question structure
type Question = {
  _id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
  difficulty: string;
};

export default function MockExam() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [showResults, setShowResults] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [secondsLeft, setSecondsLeft] = useState(600);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [started, setStarted] = useState(false);
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

  useEffect(() => {
    if (!showResults || !user?.id || questions.length === 0) return;

    const payload = {
      user_id: user.id,
      score: getScore(),
      total_questions: questions.length,
      duration_seconds: 600 - secondsLeft,
      answers: questions.map((q, i) => ({
        question_id: q._id,
        question: q.question,
        options: q.options,
        correct_index: q.correctIndex,
        selected_index: selectedAnswers[i] ?? -1,
        is_correct: selectedAnswers[i] === q.correctIndex,
      })),
    };

    console.log(payload);
    const sendResults = async () => {
      try {
        const res = await fetch("/api/saveExams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          throw new Error("Failed to save results");
        }

        console.log("✅ Exam results saved");
      } catch (error) {
        console.error("❌ Error saving results:", error);
      }
    };

    sendResults();
  }, [showResults]);

  const startExam = () => {
    setStarted(false); // reset it first to trigger useEffect

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
    setSecondsLeft(10);

    // delay setting started = true to let the effect retrigger
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

  const handleSelect = (index: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIndex]: index,
    });
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
      return selectedAnswers[i] === q.correctIndex ? score + 1 : score;
    }, 0);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? "0" + sec : sec}`;
  };

  return (
    <div className="max-w-3xl space-y-6">
      {!started ? (
        <motion.div
          className="space-y-4 border rounded-xl p-6 shadow-lg bg-background"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl font-bold">Start Mock Exam</h2>
          <div className="flex-row gap-4 sm:flex-row items-center gap-4">
            <p className="text-lg mb-6 text-gray-700">
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
              <div>
                <p className="font-semibold">Cost</p>
                <p>
                  100 USD.{" "}
                  <a
                    href="https://aws.amazon.com/certification/policies/before-testing/"
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    Exam pricing
                  </a>
                </p>
              </div>
            </div>
            <Button
              className="cursor-pointer mt-4 px-6 py-2 mt-4 sm:mt-0 text-white bg-blue-600 hover:bg-blue-700"
              onClick={startExam}
            >
              🚀 Start Exam
            </Button>
          </div>
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
                    {questions[currentIndex].options.map((option, i) => (
                      <Button
                        key={i}
                        variant={
                          selectedAnswers[currentIndex] === i
                            ? "default"
                            : "outline"
                        }
                        onClick={() => handleSelect(i)}
                        className="justify-start"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={handleNext}
                      disabled={selectedAnswers[currentIndex] === undefined}
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
            const userIdx = selectedAnswers[idx];
            const isCorrect = userIdx === q.correctIndex;
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
                    Your answer: <strong>{q.options[userIdx] || "None"}</strong>
                    {isCorrect
                      ? " ✅"
                      : ` ❌ (Correct: ${q.options[q.correctIndex]})`}
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
