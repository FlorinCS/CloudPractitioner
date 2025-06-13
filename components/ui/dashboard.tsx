"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { format, subDays, isSameDay, parseISO } from "date-fns";

interface ExamResult {
  id: number;
  score: number;
  totalQuestions: number;
  durationSeconds: number;
  submittedAt: string;
  answers: any[];
}

export default function UserDashboard({ user }) {
  const [examHistory, setExamHistory] = useState<ExamResult[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [practiceProgress, setPracticeProgress] = useState<number | null>(null);
  const [flashcardProgress, setFlashcardProgress] = useState<number | null>(
    null
  );
  const [answeredQuestions, setAnsweredQuestions] = useState(0);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("/api/getExamHistory");
        if (!res.ok) throw new Error("Failed to load history");
        const data = await res.json();
        setExamHistory(data.exams);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingHistory(false);
      }
    }

    function loadLocalProgress() {
      try {
        const rawPractice = localStorage.getItem("practice-progress");
        const practiceData = rawPractice ? JSON.parse(rawPractice) : null;
        if (practiceData?.answers?.length) {
          const answered = practiceData.answers.filter((a: any) => a !== null);
          setPracticeProgress(
            Math.round((answered.length / practiceData.answers.length) * 100)
          );
          setAnsweredQuestions(answered.length);
        }

        const rawFlashcard = localStorage.getItem("flashcard_progress");
        const flashcardData = rawFlashcard ? JSON.parse(rawFlashcard) : {};

        const knownCount = Object.values(flashcardData).filter(
          (val) => val === "known"
        ).length;
        const total = Object.keys(flashcardData).length;

        if (total > 0) {
          setFlashcardProgress(Math.round((knownCount / 20) * 100));
        }
      } catch (err) {
        console.error("Error loading local progress:", err);
      }
    }

    fetchHistory();
    loadLocalProgress();
  }, []);

  const lastExam = examHistory.slice(-1)[0];
  const lastMockScore = lastExam
    ? Math.round((lastExam.score / lastExam.totalQuestions) * 100)
    : 0;

  const averageMockScore =
    examHistory.length > 0
      ? Math.round(
          (examHistory.reduce((acc, e) => acc + e.score, 0) /
            examHistory.reduce((acc, e) => acc + e.totalQuestions, 0)) *
            100
        )
      : 0;

  const mockExamsTaken = examHistory.length;
  const questionsAnswered = examHistory.reduce(
    (acc, ex) => acc + ex.totalQuestions,
    0
  );

  const chartData = [
    { category: "Last Mock", score: lastMockScore },
    { category: "Avg. Mock", score: averageMockScore },
    { category: "Practice", score: practiceProgress ?? 0 },
    { category: "Flashcards", score: flashcardProgress ?? 0 },
  ];

  // 🔁 Build last 7 days activity chart
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(today, 6 - i);
    const dateLabel = format(date, "EEE"); // e.g., "Mon"
    let examsOnThisDay = examHistory.filter((exam) =>
      isSameDay(date, parseISO(exam.submittedAt))
    );

    const averageScore =
      examsOnThisDay.length > 0
        ? Math.round(
            examsOnThisDay.reduce(
              (acc, ex) => acc + (ex.score / ex.totalQuestions) * 100,
              0
            ) / examsOnThisDay.length
          )
        : 0;

    return {
      day: dateLabel,
      exams: examsOnThisDay.length,
      avgScore: averageScore,
    };
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4">
      <h1 className="text-3xl font-bold">
        Hi, {user?.name ?? "Future Cloud Practitioner"}! 👋
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/dashboard/practice">
          <Button className="w-full cursor-pointer">🧠 Practice</Button>
        </Link>
        <Link href="/dashboard/simulate">
          <Button className="w-full cursor-pointer">📝 Mock Exam</Button>
        </Link>
        <Link href="/dashboard/flashcards">
          <Button className="w-full cursor-pointer">💡 Flashcards</Button>
        </Link>
        <Link href="/dashboard/cheatsheet">
          <Button className="w-full cursor-pointer">📚 Cheatsheets</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Last Mock Score</p>
            <p className="text-2xl font-semibold">{lastMockScore}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Questions Answered</p>
            <p className="text-2xl font-semibold">{answeredQuestions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Mock Exams Taken</p>
            <p className="text-2xl font-semibold">{mockExamsTaken}</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-md">
        <h2 className="text-lg font-semibold mb-4">🎓 Progress Overview</h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Mock Exam Completion</span>
            <span className="font-medium">
              {Math.round(
                examHistory.length && questionsAnswered
                  ? (questionsAnswered / (examHistory.length * 65)) * 100
                  : 0
              )}
              %
            </span>
          </div>
          <div className="w-full bg-gray-200 h-2.5 rounded-full">
            <div
              className="bg-indigo-400 h-2.5 rounded-full"
              style={{
                width: `${Math.round(
                  examHistory.length && questionsAnswered
                    ? (questionsAnswered / (examHistory.length * 65)) * 100
                    : 0
                )}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-md">
          <h2 className="text-lg font-semibold mb-2">
            📊 Performance Overview
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value) => `${value}%`} />
              <Bar dataKey="score" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md">
          <h2 className="text-lg font-semibold mb-2">📈 Weekly Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={last7Days}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="exams"
                stroke="#4f46e5"
                strokeWidth={3}
                name="Exams Taken"
              />
              <Line
                type="monotone"
                dataKey="avgScore"
                stroke="#22c55e"
                strokeWidth={3}
                name="Avg. Score (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
