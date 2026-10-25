"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Pencil,
  Eye,
  LayoutDashboard,
  History,
  ChevronUp,
  ChevronDown,
  X,
} from "lucide-react";
import { useAdminEdit } from "./admin-edit-context";
import { motion, AnimatePresence } from "framer-motion";

export function AdminToolbar() {
  const { isAdmin, adminInfo, editMode, toggleEditMode } = useAdminEdit();
  const [expanded, setExpanded] = useState(false);

  // Only render for logged-in admins on public pages
  if (!isAdmin) return null;

  return (
    <div
      data-admin-ui="true"
      data-admin-toolbar="true"
      className="admin-toolbar-root fixed bottom-5 right-5 z-[999999] flex flex-col items-end gap-2"
    >
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="bg-[#0d0e13]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_20px_rgba(225,29,72,0.15)] p-4 w-72 text-white"
          >
            {/* Admin Info */}
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-[#e11d48] flex items-center justify-center text-[11px] font-extrabold uppercase shadow-[0_0_10px_rgba(225,29,72,0.5)]">
                  {adminInfo?.name?.charAt(0) || "A"}
                </div>
                <div>
                  <div className="text-xs font-bold text-white/90 truncate max-w-[140px]">
                    {adminInfo?.name || "Admin"}
                  </div>
                  <div className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">
                    {adminInfo?.role || "admin"}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setExpanded(false)}
                className="text-white/40 hover:text-white/80 transition-colors p-1 rounded-lg hover:bg-white/10"
                aria-label="Close toolbar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Edit Mode Toggle */}
            <button
              type="button"
              onClick={toggleEditMode}
              className={`w-full flex items-center justify-between gap-3 rounded-xl px-3.5 py-3 text-sm font-bold transition-all mb-2 ${
                editMode
                  ? "bg-blue-600/20 border border-blue-500/40 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.2)]"
                  : "bg-white/[0.06] border border-white/10 text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {editMode ? (
                  <Eye className="h-4 w-4 text-blue-400" />
                ) : (
                  <Pencil className="h-4 w-4 text-[#e11d48]" />
                )}
                <span>{editMode ? "Exit Edit Mode" : "Enter Edit Mode"}</span>
              </div>
              <div
                className={`w-10 h-5 rounded-full relative transition-colors ${
                  editMode ? "bg-blue-600" : "bg-white/20"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    editMode ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </div>
            </button>

            {editMode && (
              <div className="mb-3 px-2 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <div className="text-[11px] font-bold text-blue-300 flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  Universal Visual Editor Active
                </div>
                <p className="text-[11px] text-blue-200/85 leading-relaxed">
                  Hover and click <strong>ANY text, card, or element</strong> on <strong>ANY page</strong> to edit or hide it.
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-blue-300/80 font-medium">
                  <span className="bg-white/10 px-1.5 py-0.5 rounded font-mono">Enter</span> Save
                  <span className="opacity-40">•</span>
                  <span className="bg-white/10 px-1.5 py-0.5 rounded font-mono">Esc</span> Cancel
                </div>
              </div>
            )}

            {/* Quick Links */}
            <div className="flex flex-col gap-1.5">
              <Link
                href="/admin/changes"
                className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors border border-transparent hover:border-white/10"
              >
                <History className="h-4 w-4 text-amber-400" />
                <span>Changes History</span>
              </Link>
              <Link
                href="/admin"
                className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors border border-transparent hover:border-white/10"
              >
                <LayoutDashboard className="h-4 w-4 text-emerald-400" />
                <span>Admin Dashboard</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Buttons Bar: In Edit Mode shows instant Stop button + Pencil FAB */}
      <div className="flex items-center gap-2">
        {editMode && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            type="button"
            onClick={toggleEditMode}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-full shadow-[0_4px_16px_rgba(37,99,235,0.45)] transition-all active:scale-95 border border-blue-400/30"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Stop Editing</span>
          </motion.button>
        )}

        <motion.button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={editMode ? "Edit Mode Active (Click to menu)" : "Admin Visual Editor"}
          className={`group relative flex items-center gap-2 rounded-full px-4 py-3 text-white text-sm font-bold shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all ${
            editMode
              ? "bg-blue-600 shadow-[0_0_24px_rgba(59,130,246,0.5)] ring-2 ring-blue-400/50"
              : "bg-[#e11d48] shadow-[0_0_24px_rgba(225,29,72,0.45)]"
          }`}
        >
          <Pencil className={`h-4.5 w-4.5 ${editMode ? "animate-pulse" : ""}`} />
          <span className="hidden sm:inline">
            {editMode ? "Editing" : "Admin"}
          </span>
          {expanded ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronUp className="h-3.5 w-3.5" />
          )}

          {/* Pulsing ring when in edit mode */}
          {editMode && (
            <span className="absolute inset-0 rounded-full animate-ping bg-blue-500/30 pointer-events-none" />
          )}
        </motion.button>
      </div>
    </div>
  );
}
