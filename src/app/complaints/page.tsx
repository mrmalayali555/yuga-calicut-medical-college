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
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-sm";

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="text-center max-w-xl mx-auto mb-12"
        >
          <p className="text-xs font-semibold tracking-wider uppercase text-emerald-700 mb-3">
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
              className="card p-8 sm:p-12 text-center border-emerald-200"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200 mb-6">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <h2 className="text-2xl font-display text-[var(--text-primary)]">
                Dispatched to Council
              </h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Your submission has been registered securely.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 font-mono text-sm">
                <span className="text-emerald-800 font-medium">Docket:</span>
                <span className="font-bold text-emerald-800">{referenceId}</span>
                <button
                  onClick={handleCopy}
                  className="ml-1 text-slate-500 hover:text-emerald-800 transition-colors"
                  title="Copy Reference ID"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-700" /> : <Copy className="h-4 w-4" />}
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
              className="card p-6 sm:p-10"
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Leave blank to stay anonymous"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Batch *
                    </label>
                    <select required className={inputClasses}>
                      <option value="mbbs-1">MBBS Phase 1</option>
                      <option value="mbbs-2">MBBS Phase 2</option>
                      <option value="mbbs-3-1">MBBS Final Part 1</option>
                      <option value="mbbs-3-2">MBBS Final Part 2</option>
                      <option value="crmi">House Surgeon (CRMI)</option>
                      <option value="pg">PG Resident (MD/MS)</option>
                      <option value="allied">Nursing / Allied</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Category *
                    </label>
                    <select required className={inputClasses}>
                      <option value="hostel">Hostel & Facilities</option>
                      <option value="mess">Mess & Dining</option>
                      <option value="academic">Academic & Exams</option>
                      <option value="clinical">Clinical & Wards</option>
                      <option value="stipend">Stipend & Finance</option>
                      <option value="fest">Fest Proposals</option>
                      <option value="general">General Welfare</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <Lock className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
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
