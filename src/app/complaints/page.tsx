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

export default function ComplaintsPage() {
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
                      placeholder="Leave blank to stay anonymous"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                      Batch *
                    </label>
                    <select required className={inputClasses}>
                      <option value="mbbs-1" className="bg-[var(--bg-card)] text-[var(--text-primary)]">MBBS Phase 1</option>
                      <option value="mbbs-2" className="bg-[var(--bg-card)] text-[var(--text-primary)]">MBBS Phase 2</option>
                      <option value="mbbs-3-1" className="bg-[var(--bg-card)] text-[var(--text-primary)]">MBBS Final Part 1</option>
                      <option value="mbbs-3-2" className="bg-[var(--bg-card)] text-[var(--text-primary)]">MBBS Final Part 2</option>
                      <option value="crmi" className="bg-[var(--bg-card)] text-[var(--text-primary)]">House Surgeon (CRMI)</option>
                      <option value="pg" className="bg-[var(--bg-card)] text-[var(--text-primary)]">PG Resident (MD/MS)</option>
                      <option value="allied" className="bg-[var(--bg-card)] text-[var(--text-primary)]">Nursing / Allied</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                      Category *
                    </label>
                    <select required className={inputClasses}>
                      <option value="hostel" className="bg-[var(--bg-card)] text-[var(--text-primary)]">Hostel & Facilities</option>
                      <option value="mess" className="bg-[var(--bg-card)] text-[var(--text-primary)]">Mess & Dining</option>
                      <option value="academic" className="bg-[var(--bg-card)] text-[var(--text-primary)]">Academic & Exams</option>
                      <option value="clinical" className="bg-[var(--bg-card)] text-[var(--text-primary)]">Clinical & Wards</option>
                      <option value="stipend" className="bg-[var(--bg-card)] text-[var(--text-primary)]">Stipend & Finance</option>
                      <option value="fest" className="bg-[var(--bg-card)] text-[var(--text-primary)]">Fest Proposals</option>
                      <option value="general" className="bg-[var(--bg-card)] text-[var(--text-primary)]">General Welfare</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Brief summary"
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                    Details *
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Provide complete facts so the committee can act..."
                    className={`${inputClasses} resize-y`}
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[var(--border-primary)]">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] font-medium">
                    <Lock className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden="true" />
                    <span>Protected by anonymity protocol</span>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    {loading ? "Dispatching..." : "Submit Grievance"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
