"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Pencil, Phone, ArrowUp, ArrowDown, Hash, Search, Filter, X, Home } from "lucide-react";
import { EmptyRow, StatusPill } from "@/components/admin/admin-ui";
import { DeleteBtn } from "@/components/admin/form-fields";
import { deleteEmergency, moveEmergency, toggleShowOnHomepage } from "@/lib/actions/emergency";

type EmergencyItem = {
  id: string;
  category: string;
  name: string;
  phone: string;
  description: string | null;
  order: number;
  active: boolean;
  showOnHomepage: boolean;
};

export function AdminEmergencyManager({ items }: { items: EmergencyItem[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ["All", ...Array.from(set)];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((c) => {
      if (selectedCategory !== "All" && c.category !== selectedCategory) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
      );
    });
  }, [items, selectedCategory, searchQuery]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts by name, phone, or category..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-elevated)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 flex-wrap">
          <span className="text-xs font-semibold text-[var(--text-muted)] mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Category:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count =
              cat === "All" ? items.length : items.filter((i) => i.category === cat).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                  isSelected
                    ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-sm"
                    : "bg-[var(--bg-elevated)] border-[var(--border-primary)] text-[var(--text-secondary)] hover:border-[var(--border-accent)]"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between px-1">
        <h3 className="font-semibold text-[var(--text-primary)] text-sm">
          Contacts ({filteredItems.length} of {items.length})
        </h3>
        <span className="text-xs text-[var(--text-muted)]">
          Use ↑ ↓ to reorder priority on live emergency directory
        </span>
      </div>

      {filteredItems.length === 0 ? (
        <EmptyRow>No matching emergency contacts found.</EmptyRow>
      ) : (
        <div className="space-y-2.5">
          {filteredItems.map((c) => {
            const masterIndex = items.findIndex((item) => item.id === c.id);

            return (
              <div
                key={c.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-3.5 transition-colors hover:border-[var(--border-accent)]"
              >
                <div className="flex items-start sm:items-center gap-3 w-full sm:w-auto min-w-0">
                  <div className="flex flex-col items-center gap-0.5 shrink-0 border-r border-[var(--border-primary)] pr-2">
                    <form action={moveEmergency.bind(null, c.id, "up")}>
                      <button
                        type="submit"
                        disabled={masterIndex === 0}
                        title="Move Up"
                        className="flex h-6 w-6 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--accent-subtle)] hover:text-[var(--accent)] disabled:opacity-20"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                    </form>
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-mono font-medium text-[var(--text-muted)]">
                      <Hash className="h-2.5 w-2.5" />
                      {c.order}
                    </span>
                    <form action={moveEmergency.bind(null, c.id, "down")}>
                      <button
                        type="submit"
                        disabled={masterIndex === items.length - 1}
                        title="Move Down"
                        className="flex h-6 w-6 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--accent-subtle)] hover:text-[var(--accent)] disabled:opacity-20"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                    </form>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-[var(--text-primary)] break-words">{c.name}</span>
                      {!c.active && <StatusPill status="draft" />}
                      {c.showOnHomepage && (
                        <span className="inline-flex items-center gap-1 rounded bg-[var(--accent-muted)] border border-[var(--accent-subtle)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--accent-light)]">
                          <Home className="h-2.5 w-2.5" /> Homepage
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-[var(--text-muted)] flex-wrap">
                      <span className="rounded-md bg-[var(--accent-subtle)] px-2 py-0.5 font-medium text-[var(--accent)]">
                        {c.category}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[var(--text-secondary)] font-medium break-all">
                        <Phone className="h-3 w-3 text-[var(--text-muted)] shrink-0" /> {c.phone}
                      </span>
                      {c.description && (
                        <span className="text-[var(--text-muted)] truncate max-w-full sm:max-w-[200px]">
                          • {c.description}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 self-end sm:self-center border-t border-[var(--border-primary)] pt-2 sm:border-t-0 sm:pt-0 w-full sm:w-auto justify-end">
                  <form action={toggleShowOnHomepage.bind(null, c.id)}>
                    <button
                      type="submit"
                      title={c.showOnHomepage ? "Remove from Homepage" : "Show on Homepage"}
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                        c.showOnHomepage
                          ? "bg-[var(--accent-subtle)] text-[var(--accent)]"
                          : "text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      <Home className="h-4 w-4" />
                    </button>
                  </form>
                  <Link
                    href={`/admin/emergency/${c.id}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--accent)]"
                    title="Edit Contact"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <form action={deleteEmergency.bind(null, c.id)}>
                    <DeleteBtn label="" />
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
