"use client";

import {
  useRef,
  useState,
  useEffect,
  type KeyboardEvent,
  type ElementType,
  type HTMLAttributes,
} from "react";
import { Pencil, Check, X, Loader2 } from "lucide-react";
import { useAdminEdit } from "./admin-edit-context";

/* ────────────────────────── Props ────────────────────────── */

interface EditableTextProps extends HTMLAttributes<HTMLElement> {
  /** Unique block identifier within the page */
  blockId: string;
  /** Default content when no DB override exists */
  defaultContent: string;
  /** HTML element to render (h1, h2, p, span, div, etc.) */
  as?: ElementType;
  /** Optional page id; defaults to auto-detect from pathname */
  pageId?: string;
  /** Human-readable label shown in changes history */
  label?: string;
  /** If true, allows multi-line editing (Enter = newline) */
  multiline?: boolean;
}

/* ─────────────────────── Component ─────────────────────── */

export function EditableText({
  blockId,
  defaultContent,
  as: Tag = "span",
  pageId = "auto",
  label,
  multiline = false,
  className = "",
  style,
  ...rest
}: EditableTextProps) {
  const { isAdmin, editMode, getContent, saveContent } = useAdminEdit();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const ref = useRef<HTMLElement>(null);

  // Content from DB overrides or falls back to default
  const dbContent = getContent(pageId, blockId);
  const content = dbContent ?? defaultContent;

  // Reset editing state when edit mode is turned off
  useEffect(() => {
    if (!editMode) setIsEditing(false);
  }, [editMode]);

  // Clear "saved" indicator after 2s
  useEffect(() => {
    if (saved) {
      const t = setTimeout(() => setSaved(false), 2000);
      return () => clearTimeout(t);
    }
  }, [saved]);

  const handleSave = async () => {
    if (!ref.current) return;
    const newContent = ref.current.innerText.trim();
    if (newContent === content) {
      setIsEditing(false);
      return;
    }
    setSaving(true);
    const ok = await saveContent(pageId, blockId, newContent, content, label || blockId);
    setSaving(false);
    if (ok) {
      setSaved(true);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (ref.current) ref.current.innerText = content;
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  // ── Normal mode (not admin, or admin but edit mode off) ──
  if (!isAdmin || !editMode) {
    return (
      <Tag className={className} style={style} {...rest}>
        {content}
      </Tag>
    );
  }

  // ── Admin Edit Mode ──
  return (
    <span className="relative inline-block group/edit" data-editable-block={blockId}>
      <Tag
        ref={ref}
        className={`${className} transition-all duration-150 ${
          isEditing
            ? "outline outline-2 outline-blue-500 outline-offset-4 rounded-sm bg-blue-500/5"
            : "hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-400/60 hover:outline-offset-4 rounded-sm cursor-pointer"
        }`}
        style={style}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onClick={() => {
          if (!isEditing) {
            setIsEditing(true);
            // Focus at end of text
            requestAnimationFrame(() => {
              if (ref.current) {
                ref.current.focus();
                const range = document.createRange();
                const sel = window.getSelection();
                range.selectNodeContents(ref.current);
                range.collapse(false);
                sel?.removeAllRanges();
                sel?.addRange(range);
              }
            });
          }
        }}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          // Small delay so save/cancel buttons can be clicked
          setTimeout(() => {
            if (isEditing && ref.current) {
              handleSave();
            }
          }, 200);
        }}
        {...rest}
      >
        {content}
      </Tag>

      {/* Pencil indicator — visible on hover when not editing */}
      {!isEditing && (
        <span className="absolute -top-5 -right-1 z-50 opacity-0 group-hover/edit:opacity-100 transition-all duration-150 pointer-events-none">
          <span className="flex items-center gap-1 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap">
            <Pencil className="h-2.5 w-2.5" />
            {label || blockId}
          </span>
        </span>
      )}

      {/* Save / Cancel controls — visible when editing */}
      {isEditing && (
        <span className="absolute -top-8 right-0 z-50 flex items-center gap-1 animate-in fade-in slide-in-from-bottom-1 duration-150">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleSave(); }}
            disabled={saving}
            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Check className="h-3 w-3" />
            )}
            Save
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleCancel(); }}
            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {/* Saved confirmation */}
      {saved && !isEditing && (
        <span className="absolute -top-6 right-0 z-50 flex items-center gap-1 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg animate-in fade-in duration-200">
          <Check className="h-3 w-3" />
          Saved
        </span>
      )}
    </span>
  );
}
