"use client";

import { useState } from "react";
import {
  Send,
  CheckCircle2,
  Lock,
  Copy,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ComplaintsView() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const generatedId = `YUGA-GRV-${Math.floor(100000 + Math.random() * 900000)}`;
      setReferenceId(generatedId);
      setLoading(false);
      setSubmitted(true);
    }, 700);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referenceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputClasses =
    "w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all shadow-sm";

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[var(--bg-root)] text-[var(--text-primary)] relative overflow-hidden transition-colors">
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(var(--accent)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="text-center max-w-xl mx-auto mb-12"
        >
          <p className="text-xs font-semibold tracking-wider uppercase text-[var(--accent)] mb-3">
            Confidential Channel
          </p>
          <h1 className="text-4xl sm:text-5xl font-display text-[var(--text-primary)]">
            Grievance Desk
          </h1>
          <p className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed">
            Your direct, confidential channel to the YUGA Student Union Council.
            Drop hostel issues, academic feedback, or fest proposals.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 150, damping: 20 }}
              className="card p-8 sm:p-12 text-center border-[var(--accent)]/30 bg-[var(--accent-subtle)]"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/30 mb-6">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <h2 className="text-2xl font-display text-[var(--text-primary)]">
                Dispatched to Council
              </h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Your submission has been registered securely.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-primary)] px-4 py-2.5 font-mono text-sm shadow-xs">
                <span className="text-[var(--accent)] font-medium">Docket:</span>
                <span className="font-bold text-[var(--text-primary)]">{referenceId}</span>
                <button
                  onClick={handleCopy}
                  className="ml-1 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                  title="Copy Reference ID"
                >
                  {copied ? <Check className="h-4 w-4 text-[var(--accent)]" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-secondary"
                >
                  Submit Another
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="card p-6 sm:p-10 border-[var(--border-primary)] bg-[var(--bg-card)]"
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                      Full Name (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Leave blank for anonymous"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                      Batch / Phase
                    </label>
                    <select className={inputClasses} defaultValue="2022">
                      <option value="2020">2020 Batch (Final Year)</option>
                      <option value="2021">2021 Batch (3rd Year)</option>
                      <option value="2022">2022 Batch (2nd Year)</option>
                      <option value="2023">2023 Batch (1st Year)</option>
                      <option value="2024">2024 Batch (Freshers)</option>
                      <option value="interns">House Surgeons (Interns)</option>
                      <option value="pg">PG Residents</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                    Issue Category *
                  </label>
                  <select className={inputClasses} defaultValue="academic" required>
                    <option value="academic">Academic / Exam Schedule Feedback</option>
                    <option value="hostel">Hostel & Mess Facilities</option>
                    <option value="clinical">Clinical Postings & Library</option>
                    <option value="fest">Arts & Sports Committee Proposal</option>
                    <option value="general">General Student Representation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                    Your Concern / Proposal *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide details. What happened? What resolution are you proposing?"
                    required
                    className={inputClasses}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full justify-center text-sm py-3.5"
                  >
                    <Send className="h-4 w-4" />
                    <span>{loading ? "Registering..." : "Submit to Student Council"}</span>
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-[var(--text-muted)] pt-3 border-t border-[var(--border-primary)]">
                  <Lock className="h-3.5 w-3.5 text-[var(--accent)]" />
                  <span>Confidential submission encrypted for Union Executive Council view only</span>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
