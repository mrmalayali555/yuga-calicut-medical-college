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
    <div className="min-h-screen pt-28 pb-24 bg-gradient-to-b from-emerald-50/20 via-white to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 mb-4 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Fiscal Accountability & Audit
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-display text-[var(--text-primary)] tracking-tight">
              Union Accounts & Finance
            </h1>
            <p className="mt-4 text-base text-slate-600 leading-relaxed font-normal">
              Public financial transparency ledger of YUGA College Union 2026-2027.
              Every rupee received from grants, alumni sponsorships, and fest funds
              is documented alongside verified student expenditure receipts.
            </p>
          </motion.div>

          {/* Action button */}
          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={handlePrintReport}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-emerald-300 hover:text-emerald-800 transition-colors"
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
            className="rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-white to-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Reserve Balance
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Wallet className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 text-3xl font-display font-bold text-slate-900">
              ₹{balance.toLocaleString("en-IN")}
            </div>
            <div className="mt-2 text-xs text-slate-500 font-medium">
              Net balance available in union treasury account
            </div>
          </motion.div>

          {/* Total Inflow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Inflow (Receipts)
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 text-3xl font-display font-bold text-emerald-600">
              ₹{totalIncome.toLocaleString("en-IN")}
            </div>
            <div className="mt-2 text-xs text-slate-500 font-medium">
              Institutional allocations, endowments & sponsorships
            </div>
          </motion.div>

          {/* Total Expenditure */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Outflow (Disbursed)
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <TrendingDown className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 text-3xl font-display font-bold text-red-600">
              ₹{totalExp.toLocaleString("en-IN")}
            </div>
            <div className="mt-2 text-xs text-slate-500 font-medium">
              Audited vouchers across fest, sports & student welfare
            </div>
          </motion.div>
        </div>

        {/* Filters and Search Bar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
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
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterType === t.id
                    ? "bg-emerald-700 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search voucher or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Categories Bar */}
        {categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-xs font-medium text-slate-400 mr-2 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Categories:
            </span>
            <button
              onClick={() => setSelectedCategory("all")}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                selectedCategory === "all"
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  selectedCategory === c
                    ? "bg-emerald-700 text-white"
                    : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {/* Transactions Table / Cards */}
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-xs">
            <Receipt className="mx-auto h-10 w-10 text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800">No transactions found</h3>
            <p className="mt-1 text-xs text-slate-500">
              Try adjusting your category filter or search keywords.
            </p>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Transaction / Voucher</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((item) => {
                    const isIncome = item.kind === "income";
                    return (
                      <tr
                        key={item.id}
                        className="transition-colors hover:bg-slate-50/60"
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900 leading-snug">
                            {item.label}
                          </div>
                          {item.note && (
                            <div className="mt-0.5 text-xs text-slate-500 leading-relaxed font-normal">
                              {item.note}
                            </div>
                          )}
                          {item.receiptUrl && (
                            <a
                              href={item.receiptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:underline"
                            >
                              <FileSpreadsheet className="h-3 w-3" />
                              View Supporting Receipt / Voucher
                            </a>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-mono">
                          {formatDate(new Date(item.date))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span
                            className={`inline-block font-mono text-base font-bold ${
                              isIncome ? "text-emerald-700" : "text-red-600"
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
            <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <span>Showing {filtered.length} verified fiscal entries</span>
              <span className="flex items-center gap-1.5 font-medium text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Audited & Approved by YUGA Finance Committee
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
