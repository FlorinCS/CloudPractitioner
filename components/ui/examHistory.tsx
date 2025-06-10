"use client";

import { useEffect, useState, useMemo } from "react";
import { format, parseISO } from "date-fns";

type Answer = {
  question: string;
  is_correct: boolean;
  selected_index: number;
  correct_index: number;
  options: string[];
};

type ExamResult = {
  id: number;
  score: number;
  totalQuestions: number;
  durationSeconds: number;
  submittedAt: string;
  answers: Answer[];
};

const RESULTS_PER_PAGE = 5;

export default function ExamHistoryPage() {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [expandedExamId, setExpandedExamId] = useState<number | null>(null);
  const [scoreFilter, setScoreFilter] = useState<number | null>(null);
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch("/api/getExamHistory");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setResults(data.exams);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  // Unique filter options
  const uniqueScores = useMemo(
    () =>
      Array.from(new Set(results.map((r) => r.score))).sort((a, b) => b - a),
    [results]
  );

  const uniqueDates = useMemo(() => {
    return Array.from(
      new Set(results.map((r) => format(parseISO(r.submittedAt), "yyyy-MM-dd")))
    ).sort((a, b) => (a > b ? -1 : 1));
  }, [results]);

  // Filtered and paginated data
  const filteredResults = useMemo(() => {
    return results.filter((r) => {
      const matchScore = scoreFilter === null || r.score === scoreFilter;
      const matchDate =
        dateFilter === null ||
        format(parseISO(r.submittedAt), "yyyy-MM-dd") === dateFilter;
      return matchScore && matchDate;
    });
  }, [results, scoreFilter, dateFilter]);

  const totalPages = Math.ceil(filteredResults.length / RESULTS_PER_PAGE);
  const currentResults = filteredResults.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );

  const toggleExpand = (id: number) =>
    setExpandedExamId((prev) => (prev === id ? null : id));

  const resetPagination = () => setCurrentPage(1);
  useEffect(() => {
    resetPagination();
  }, [scoreFilter, dateFilter]);

  // Sidebar stats
  const passedExams = useMemo(
    () =>
      results.filter((r) => (r.score / r.totalQuestions) * 100 >= 70).length,
    [results]
  );

  const averageScore = useMemo(() => {
    if (results.length === 0) return 0;
    const total = results.reduce((sum, r) => sum + r.score, 0);
    return (total / results.length).toFixed(1);
  }, [results]);

  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto py-6 gap-10">
      {/* Main Content */}
      <main className="flex-1">
        <h1 className="text-3xl font-bold mb-6 text-center lg:text-left">
          📘 Exam History
        </h1>
        {/* Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-5 bg-white shadow rounded-xl border text-center">
            <p className="text-gray-500 text-sm mb-1">Total Exams</p>
            <p className="text-2xl font-semibold text-gray-800">
              {results.length}
            </p>
          </div>
          <div className="p-5 bg-white shadow rounded-xl border text-center">
            <p className="text-gray-500 text-sm mb-1">Exams Passed</p>
            <p className="text-2xl font-semibold text-green-600">
              {passedExams}
            </p>
          </div>
          <div className="p-5 bg-white shadow rounded-xl border text-center">
            <p className="text-gray-500 text-sm mb-1">Average Score</p>
            <p className="text-2xl font-semibold text-blue-600">
              {averageScore}
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Filter by Score
            </label>
            <select
              className="w-full p-2 border rounded-md cursor-pointer"
              value={scoreFilter ?? ""}
              onChange={(e) =>
                setScoreFilter(e.target.value ? Number(e.target.value) : null)
              }
            >
              <option value="">All</option>
              {uniqueScores.map((score) => (
                <option key={score} value={score}>
                  {score}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Filter by Date
            </label>
            <select
              className="w-full p-2 border rounded-md cursor-pointer"
              value={dateFilter ?? ""}
              onChange={(e) => setDateFilter(e.target.value || null)}
            >
              <option value="">All</option>
              {uniqueDates.map((date) => (
                <option key={date} value={date}>
                  {format(parseISO(date), "dd MMM yyyy")}
                </option>
              ))}
            </select>
          </div>
        </div>
        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && currentResults.length === 0 && (
          <p className="text-center text-gray-500">No exams found.</p>
        )}

        {!loading &&
          currentResults.map((result) => {
            const percentage = (result.score / result.totalQuestions) * 100;
            const passed = percentage >= 70;

            return (
              <div
                key={result.id}
                className="bg-white border rounded-xl shadow-sm mb-6 transition"
              >
                <button
                  onClick={() => toggleExpand(result.id)}
                  className="cursor-pointer w-full text-left p-6 flex justify-between items-center hover:bg-gray-50"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {format(
                        parseISO(result.submittedAt),
                        "dd MMM yyyy • HH:mm"
                      )}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Duration: {Math.floor(result.durationSeconds / 60)}m{" "}
                      {result.durationSeconds % 60}s
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p
                      className={`text-sm font-semibold ${
                        passed ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {passed ? "✅ Passed" : "❌ Failed"}
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {result.score}/{result.totalQuestions}
                    </p>
                  </div>
                </button>

                {expandedExamId === result.id && (
                  <div className="p-6 pt-0 space-y-6">
                    {result.answers.map((answer, index) => (
                      <div
                        key={index}
                        className={`p-5 rounded-xl border ${
                          answer.is_correct
                            ? "bg-green-50 border-green-200"
                            : "bg-red-50 border-red-200"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <p className="font-medium text-gray-800">
                            Q{index + 1}: {answer.question}
                          </p>
                          <span
                            className={`text-xs font-bold px-3 py-1 rounded-full ${
                              answer.is_correct
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {answer.is_correct ? "Correct" : "Incorrect"}
                          </span>
                        </div>
                        <ul className="mt-2 space-y-2">
                          {answer.options.map((option, i) => {
                            const isSelected = i === answer.selected_index;
                            const isCorrect = i === answer.correct_index;
                            return (
                              <li
                                key={i}
                                className={`p-3 rounded-md border text-sm ${
                                  isCorrect
                                    ? "bg-green-100 border-green-300"
                                    : isSelected
                                    ? "bg-red-100 border-red-300"
                                    : "bg-gray-50 border-gray-200"
                                }`}
                              >
                                {option}
                                {isSelected && (
                                  <span className="ml-2 text-xs text-blue-600 font-medium">
                                    (Your answer)
                                  </span>
                                )}
                                {isCorrect && (
                                  <span className="ml-2 text-xs text-green-600 font-medium">
                                    (Correct)
                                  </span>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded cursor-pointer ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
