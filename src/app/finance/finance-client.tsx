"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Download,
  Filter,
  Search,
  CheckCircle2,
  FileSpreadsheet,
  Receipt,
  Sparkles,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { COLLEGE, YUGA } from "@/lib/site";
import { motion, AnimatePresence } from "framer-motion";

export interface TransactionEntry {
  id: string;
  kind: "income" | "expenditure";
  category: string;
  label: string;
  amount: number;
  date: string;
  note?: string;
  receiptUrl?: string;
}

export function FinanceClientView({
  initialEntries,
}: {
  initialEntries: TransactionEntry[];
}) {
  const [filterType, setFilterType] = useState<"all" | "income" | "expenditure">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = Array.from(
    new Set(initialEntries.map((e) => e.category))
  ).filter(Boolean);

  const filtered = initialEntries.filter((e) => {
    if (filterType !== "all" && e.kind !== filterType) return false;
    if (selectedCategory !== "all" && e.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        e.label.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        (e.note && e.note.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const totalIncome = initialEntries
    .filter((e) => e.kind === "income")
    .reduce((s, e) => s + e.amount, 0);

  const totalExp = initialEntries
    .filter((e) => e.kind === "expenditure")
    .reduce((s, e) => s + e.amount, 0);

  const balance = totalIncome - totalExp;

  function handlePrintReport() {
    window.print();
  }

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[var(--bg-root)] text-[var(--text-primary)] relative overflow-hidden transition-colors">
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(var(--accent)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/20 bg-[var(--accent-subtle)] px-3.5 py-1 mb-4 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                Fiscal Accountability & Audit
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-display text-[var(--text-primary)] tracking-tight">
              Union Accounts & Finance
            </h1>
            <p className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed font-normal">
              Public financial transparency ledger of YUGA College Union 2026-2027.
              Every rupee received from grants, alumni sponsorships, and fest funds
              is documented alongside verified student expenditure receipts.
            </p>
          </motion.div>

          {/* Action button */}
          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={handlePrintReport}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] px-4 py-2.5 text-xs font-semibold text-[var(--text-primary)] shadow-2xs hover:bg-[var(--accent-subtle)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Download Statement</span>
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {/* Net Balance */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-[var(--accent)]/30 bg-[var(--accent-subtle)] p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                Reserve Balance
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/30">
                <Wallet className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 text-3xl font-display font-bold text-[var(--text-primary)]">
              ₹{balance.toLocaleString("en-IN")}
            </div>
            <div className="mt-2 text-xs text-[var(--text-secondary)] font-medium">
              Net balance available in union treasury account
            </div>
          </motion.div>

          {/* Total Inflow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Total Inflow (Receipts)
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 text-3xl font-display font-bold text-emerald-500">
              ₹{totalIncome.toLocaleString("en-IN")}
            </div>
            <div className="mt-2 text-xs text-[var(--text-muted)] font-medium">
              Institutional allocations, endowments & sponsorships
            </div>
          </motion.div>

          {/* Total Expenditure */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Total Outflow (Disbursed)
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
                <TrendingDown className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 text-3xl font-display font-bold text-rose-500">
              ₹{totalExp.toLocaleString("en-IN")}
            </div>
            <div className="mt-2 text-xs text-[var(--text-muted)] font-medium">
              Audited vouchers across fest, sports & student welfare
            </div>
          </motion.div>
        </div>

        {/* Filters and Search Bar */}
        <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-4 shadow-xs mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Kind filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {(
              [
                { id: "all", label: "All Transactions" },
                { id: "income", label: "Income Only" },
                { id: "expenditure", label: "Expenses Only" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setFilterType(t.id)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  filterType === t.id
                    ? "bg-[var(--accent)] text-white shadow-xs"
                    : "text-[var(--text-secondary)] hover:bg-[var(--accent-subtle)] hover:text-[var(--accent)]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search voucher or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] pl-9 pr-4 py-1.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
        </div>

        {/* Categories Bar */}
        {categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-xs font-medium text-[var(--text-muted)] mr-2 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Categories:
            </span>
            <button
              onClick={() => setSelectedCategory("all")}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--bg-card)] border border-[var(--border-primary)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                  selectedCategory === c
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--bg-card)] border border-[var(--border-primary)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {/* Transactions Table / Cards */}
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-16 text-center shadow-xs">
            <Receipt className="mx-auto h-10 w-10 text-[var(--text-muted)] mb-3" />
            <h3 className="text-base font-bold text-[var(--text-primary)]">No transactions found</h3>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              Try adjusting your category filter or search keywords.
            </p>
          </div>
        ) : (
          <div className="rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[var(--text-secondary)]">
                <thead className="border-b border-[var(--border-primary)] bg-[var(--bg-surface)] text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">
                  <tr>
                    <th className="px-6 py-4">Transaction / Voucher</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-primary)]">
                  {filtered.map((item) => {
                    const isIncome = item.kind === "income";
                    return (
                      <tr
                        key={item.id}
                        className="transition-colors hover:bg-[var(--accent-subtle)]/20"
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold text-[var(--text-primary)] leading-snug">
                            {item.label}
                          </div>
                          {item.note && (
                            <div className="mt-0.5 text-xs text-[var(--text-muted)] leading-relaxed font-normal">
                              {item.note}
                            </div>
                          )}
                          {item.receiptUrl && (
                            <a
                              href={item.receiptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--accent)] hover:underline"
                            >
                              <FileSpreadsheet className="h-3 w-3" />
                              View Supporting Receipt / Voucher
                            </a>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center rounded-lg bg-[var(--bg-surface)] border border-[var(--border-primary)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)]">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-[var(--text-muted)] font-mono">
                          {formatDate(new Date(item.date))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span
                            className={`inline-block font-mono text-base font-bold ${
                              isIncome ? "text-emerald-500" : "text-rose-500"
                            }`}
                          >
                            {isIncome ? "+" : "−"}₹{item.amount.toLocaleString("en-IN")}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="border-t border-[var(--border-primary)] bg-[var(--bg-surface)] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
              <span>Showing {filtered.length} verified fiscal entries</span>
              <span className="flex items-center gap-1.5 font-medium text-[var(--accent)]">
                <CheckCircle2 className="h-4 w-4 text-[var(--accent)]" />
                Audited & Approved by YUGA Finance Committee
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
