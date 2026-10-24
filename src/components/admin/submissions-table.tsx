"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Download, Search, Users, ArrowLeft, Calendar, FileText, CheckCircle2 } from "lucide-react";

interface SubmissionsTableProps {
  formTitle: string;
  fields: { id: string; label: string; order: number }[];
  submissions: {
    id: string;
    createdAt: string;
    data: Record<string, any>;
  }[];
}

export function SubmissionsTable({
  formTitle,
  fields,
  submissions,
}: SubmissionsTableProps) {
  const [search, setSearch] = useState("");

  const filtered = submissions.filter((sub) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return Object.values(sub.data).some((val) =>
      String(val).toLowerCase().includes(term)
    );
  });

  const exportCSV = () => {
    if (submissions.length === 0) return;

    // Headers: Date, Ticket Ref, [Fields...]
    const headers = [
      "Submission ID",
      "Submitted At",
      "Ticket Ref",
      ...fields.map((f) => `"${f.label.replace(/"/g, '""')}"`),
    ];

    const rows = submissions.map((sub) => {
      const ticketRef = sub.data._ticketRef || "";
      const fieldValues = fields.map((f) => {
        const val = sub.data[f.id] ?? sub.data[f.label] ?? "";
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      return [
        sub.id,
        sub.createdAt,
        `"${ticketRef}"`,
        ...fieldValues,
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `${formTitle.replace(/[^a-zA-Z0-9]/g, "_")}_attendees_${Date.now()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search participant responses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          />
        </div>

        <button
          type="button"
          onClick={exportCSV}
          disabled={submissions.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-sm cursor-pointer"
        >
          <Download className="h-4 w-4" />
          Export to CSV ({submissions.length})
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          <Users className="mx-auto h-8 w-8 text-slate-300 mb-3" />
          <p className="font-semibold text-slate-700">No submissions found</p>
          <p className="text-xs text-slate-400 mt-1">
            {search ? "No results match your filter criteria." : "No attendees have registered for this form yet."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/80 text-left uppercase tracking-wider text-slate-500 font-semibold">
              <tr>
                <th className="px-5 py-3.5">#</th>
                <th className="px-5 py-3.5">Ticket Ref</th>
                <th className="px-5 py-3.5">Date</th>
                {fields.map((f) => (
                  <th key={f.id} className="px-5 py-3.5 whitespace-nowrap">
                    {f.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((sub, idx) => {
                const ticketRef = sub.data._ticketRef || "N/A";

                return (
                  <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3 text-slate-400 font-mono">
                      {idx + 1}
                    </td>
                    <td className="px-5 py-3 font-mono font-bold text-emerald-700 whitespace-nowrap">
                      {ticketRef}
                    </td>
                    <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                      {sub.createdAt}
                    </td>
                    {fields.map((f) => {
                      const val = sub.data[f.id] ?? sub.data[f.label] ?? "—";
                      return (
                        <td key={f.id} className="px-5 py-3 text-slate-800 max-w-[220px] truncate">
                          {String(val)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
