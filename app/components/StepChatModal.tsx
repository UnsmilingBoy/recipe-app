"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircleQuestion, Loader2 } from "lucide-react";

interface Step {
  id: number;
  title?: string;
  description: string;
  duration?: string;
  ingredients?: string[];
}

interface StepChatModalProps {
  step: Step;
  isOpen: boolean;
  onClose: () => void;
  language: "en" | "fa";
}

export default function StepChatModal({
  step,
  isOpen,
  onClose,
  language,
}: StepChatModalProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const text = {
    en: {
      title: "Ask About This Step",
      placeholder: "Ask a question about this step...",
      send: "Send",
      close: "Close",
      step: "Step",
      asking: "Thinking...",
      error: "Error:",
    },
    fa: {
      title: "درباره این مرحله بپرسید",
      placeholder: "سوال خود را درباره این مرحله بپرسید...",
      send: "ارسال",
      close: "بستن",
      step: "مرحله",
      asking: "در حال فکر کردن...",
      error: "خطا:",
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    setLoading(true);
    setError(null);
    setAnswer(null);

    try {
      const response = await fetch("/api/step-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: question.trim(), step, language }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get answer");
      }

      const data = await response.json();
      setAnswer(data.answer);
      setQuestion("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed w-screen h-screen inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl z-50 flex flex-col max-h-[90vh]"
            dir={language === "fa" ? "rtl" : "ltr"}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-zinc-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center bg-primary text-white font-bold rounded-full">
                  {step.id}
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    {text[language].title}
                  </h2>
                  {step.title && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {step.title}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-zinc-800 rounded-lg transition-colors"
                aria-label={text[language].close}
              >
                <X size={24} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Step Info */}
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {step.description}
              </p>
              {step.duration && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  ⏱️ {step.duration}
                </p>
              )}
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {!answer && !loading && !error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center py-8"
                >
                  <MessageCircleQuestion
                    size={48}
                    className="text-gray-400 dark:text-gray-600 mb-4"
                  />
                  <p className="text-gray-500 dark:text-gray-400">
                    {language === "en"
                      ? "Ask any question about this cooking step"
                      : "هر سوالی درباره این مرحله از پخت بپرسید"}
                  </p>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Loader2 size={18} className="text-white animate-spin" />
                  </div>
                  <div className="flex-1 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4">
                    <p className="text-gray-600 dark:text-gray-400">
                      {text[language].asking}
                    </p>
                  </div>
                </motion.div>
              )}

              {answer && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <MessageCircleQuestion size={18} className="text-white" />
                  </div>
                  <div className="flex-1 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4">
                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                      {answer}
                    </p>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                >
                  <p className="text-red-800 dark:text-red-200">
                    <strong>{text[language].error}</strong> {error}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSubmit}
              className="p-4 sm:p-6 border-t border-gray-200 dark:border-zinc-700"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={text[language].placeholder}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gray-100 dark:bg-zinc-800 border-0 rounded-xl focus:ring-2 focus:ring-primary dark:focus:ring-primary text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed outline-none"
                />
                <button
                  type="submit"
                  disabled={loading || !question.trim()}
                  className="px-4 sm:px-6 py-3 bg-primary hover:bg-primary-dark cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Send size={20} />
                  )}
                  <span className="hidden sm:inline">
                    {text[language].send}
                  </span>
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
