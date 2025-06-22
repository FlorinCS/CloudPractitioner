"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, Loader, CheckCircle } from "lucide-react";

export default function StarRating() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 500;

  useEffect(() => {
    setCharCount(feedback.length);
  }, [feedback]);

  // Precomputed placeholder text (performance optimization)
  const feedbackPlaceholder = useMemo(() => {
    if (rating === 0) return "What’s your opinion about your experience?";
    if (rating <= 2)
      return "We’re sorry for the bad experience. What can we improve?";
    if (rating === 3) return "What did you like and what could be improved?";
    return "Thanks for the positive rating! What did you like the most?";
  }, [rating]);

  // Precomputed rating color
  const getRatingColor = useMemo(() => {
    if (rating === 0) return "text-gray-400"; // No rating
    if (rating === 1) return "text-red-600"; // Very bad
    if (rating === 2) return "text-orange-500"; // Bad
    if (rating === 3) return "text-yellow-500"; // Neutral
    if (rating === 4) return "text-green-500"; // Good
    return "text-blue-500"; // Excellent
  }, [rating]);

  // Handle star hover
  const handleStarHover = (index) => {
    if (!submitted) setHover(index);
  };

  // Handle star click
  const handleStarClick = (index) => {
    if (!submitted) setRating(index);
  };

  // Submit feedback
  const handleSubmit = useCallback(async () => {
    if (rating === 0 && !feedback.trim()) return; // Prevent empty submission

    setError("");
    setLoading(true);

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL ||
        "https://www.cloud-practitioner.com";
      const response = await fetch(`${baseUrl}/api/saveDataRating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          content: feedback,
        }),
      });

      if (!response.ok) throw new Error("Failed to save data");

      setSubmitted(true);
      setRating(0);
      setFeedback("");
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [rating, feedback]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-full rounded-xl bg-white p-6 shadow-lg "
    >
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
            >
              <CheckCircle size={60} className="mb-4 text-green-500" />
            </motion.div>
            <h3 className="mb-2 text-xl font-bold text-gray-800">
              Thank you for your feedback!
            </h3>
            <p className="text-gray-600">
              We appreciate your time to help us improve.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSubmitted(false);
                setRating(0);
                setFeedback("");
              }}
              className="mt-6 rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200"
            >
              Submit more feedback
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between w-full">
              <h2 className="mx-auto text-lg font-semibold text-gray-800">
                How was your experience?
              </h2>
            </div>

            {/* Star Rating */}
            <div className="flex items-center justify-center space-x-2">
              {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.2, y: -4 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleStarClick(starValue)}
                    onMouseEnter={() => handleStarHover(starValue)}
                    onMouseLeave={() => setHover(0)}
                    className={`rounded-full p-1 ${
                      starValue <= (hover || rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    aria-label={`Rate ${starValue} stars`}
                  >
                    <Star
                      size={32}
                      fill={
                        starValue <= (hover || rating) ? "currentColor" : "none"
                      }
                    />
                  </motion.button>
                );
              })}
            </div>

            {rating > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <span className={`text-sm font-medium ${getRatingColor}`}>
                  {rating === 1 && "Very dissatisfied"}
                  {rating === 2 && "Dissatisfied"}
                  {rating === 3 && "Neutral"}
                  {rating === 4 && "Satisfied"}
                  {rating === 5 && "Very satisfied"}
                </span>
              </motion.div>
            )}

            {/* Feedback Textarea */}
            <div className="space-y-2">
              <textarea
                className="w-full resize-none rounded-lg border border-gray-300 p-3 text-gray-700 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
                rows="4"
                placeholder={feedbackPlaceholder}
                value={feedback}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_CHARS) {
                    setFeedback(e.target.value);
                  }
                }}
              ></textarea>
              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  {charCount}/{MAX_CHARS}
                </span>
                {feedback.trim() && (
                  <button
                    onClick={() => setFeedback("")}
                    className="hover:text-gray-700"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={loading || (rating === 0 && !feedback.trim())}
              className={`flex w-full items-center justify-center rounded-lg px-4 py-3 font-semibold text-white transition-colors ${
                loading || (rating === 0 && !feedback.trim())
                  ? "cursor-not-allowed bg-gray-300"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <Loader size={18} className="mr-2 animate-spin" />
              ) : (
                <Send size={18} className="mr-2" />
              )}
              {loading ? "Sending..." : "Submit feedback"}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
