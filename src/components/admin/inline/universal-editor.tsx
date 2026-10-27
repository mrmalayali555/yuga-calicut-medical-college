"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { Check, X, EyeOff, Eye, Loader2, Sparkles, Image as ImageIcon } from "lucide-react";
import { useAdminEdit } from "./admin-edit-context";

/* ──────────────────────────────── Helpers ──────────────────────────────── */

function hashString(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
}

function getElementPath(el: HTMLElement): string {
  const parts: string[] = [];
  let curr: HTMLElement | null = el;

  while (curr && curr !== document.body && curr !== document.documentElement) {
    let part = curr.tagName.toLowerCase();
    if (curr.id) {
      part += `#${curr.id}`;
      parts.unshift(part);
      break;
    }
    const parentEl: HTMLElement | null = curr.parentElement;
    if (parentEl) {
      const siblings = Array.from(parentEl.children).filter(
        (child: Element) => child.tagName === curr!.tagName
      );
      if (siblings.length > 1) {
        const index = siblings.indexOf(curr) + 1;
        part += `:nth-of-type(${index})`;
      }
    }
    parts.unshift(part);
    curr = parentEl;
  }

  return parts.join(" > ");
}

function pathnameToPageId(pathname: string): string {
  if (pathname === "/") return "home";
  return pathname.replace(/^\//, "").replace(/\//g, "-");
}

const EDITABLE_TAGS = new Set([
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "P",
  "SPAN",
  "A",
  "BUTTON",
  "LI",
  "LABEL",
  "BLOCKQUOTE",
  "B",
  "STRONG",
  "EM",
  "I",
  "SMALL",
  "FIGCAPTION",
  "TD",
  "TH",
]);

function isEditableElement(el: HTMLElement): boolean {
  if (!el || !(el instanceof HTMLElement)) return false;

  // Ignore admin tools, modals, scripts, SVG
  if (
    el.closest("[data-admin-ui]") ||
    el.closest("[data-admin-toolbar]") ||
    el.closest(".admin-toolbar-root") ||
    el.closest("#universal-admin-editor")
  ) {
    return false;
  }

  const tag = el.tagName.toUpperCase();
  if (
    tag === "SCRIPT" ||
    tag === "STYLE" ||
    tag === "SVG" ||
    tag === "PATH" ||
    tag === "NOSCRIPT" ||
    tag === "IFRAME" ||
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    tag === "VIDEO" ||
    tag === "AUDIO"
  ) {
    return false;
  }

  // Check direct text content or leaf-like elements
  if (EDITABLE_TAGS.has(tag)) {
    const text = el.innerText?.trim() ?? "";
    return text.length > 0 && text.length < 2000;
  }

  // Allow DIVs that are purely text containers (no complex children)
  if (tag === "DIV") {
    const hasOnlyText =
      el.children.length === 0 && (el.innerText?.trim()?.length ?? 0) > 0;
    const hasInlineChildrenOnly =
      el.children.length > 0 &&
      Array.from(el.children).every((c) =>
        ["SPAN", "B", "I", "STRONG", "EM", "SMALL", "BR"].includes(
          c.tagName.toUpperCase()
        )
      );
    return (
      (hasOnlyText || hasInlineChildrenOnly) &&
      (el.innerText?.trim()?.length ?? 0) < 1500
    );
  }

  return false;
}

/* ─────────────────────── Universal Inline Editor ─────────────────────── */

export function UniversalInlineEditor() {
  const { isAdmin, editMode, saveContent, refreshContent } = useAdminEdit();
  const pathname = usePathname();

  // Active hover element
  const [hoveredEl, setHoveredEl] = useState<HTMLElement | null>(null);
  const [hoverRect, setHoverRect] = useState<DOMRect | null>(null);

  // Active editing element
  const [editingEl, setEditingEl] = useState<HTMLElement | null>(null);
  const [editRect, setEditRect] = useState<DOMRect | null>(null);
  const [originalValue, setOriginalValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Mounted portal check
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const pageId = pathnameToPageId(pathname);

  // ── 1. DOM Overrides Applicator — ADMIN EDIT MODE ONLY ──
  const applyOverridesToDom = useCallback(() => {
    // Only apply in admin edit mode. Never patch DOM for regular visitors.
    if (!isAdmin || !editMode) return;
    if (pathname.startsWith("/admin")) return;

    fetch(`/api/content?page=${pageId}`)
      .then((res) => res.json())
      .then((data) => {
        const blocks: Array<{
          pageId: string;
          blockId: string;
          content: string;
          type: string;
          previousValue?: string;
        }> = data.blocks || [];

        if (!blocks.length) return;

        blocks.forEach((block) => {
          // Priority 1: Match by explicit data attribute only
          const exactMatch = document.querySelector(
            `[data-editable-block="${block.blockId}"]`
          ) as HTMLElement | null;

          if (exactMatch) {
            // Never override elements marked with data-no-override
            if (exactMatch.closest("[data-no-override]")) return;

            if (block.type === "hidden" || block.content === "__hidden__") {
              exactMatch.style.display = "none";
            } else {
              if (exactMatch.innerText !== block.content) {
                exactMatch.innerText = block.content;
              }
            }
          }
        });
      })
      .catch(() => {});
  }, [isAdmin, editMode, pageId, pathname]);

  useEffect(() => {
    applyOverridesToDom();
    // Run again after dynamic components hydrate
    const t = setTimeout(applyOverridesToDom, 1200);
    return () => clearTimeout(t);
  }, [applyOverridesToDom]);

  // ── 2. Update Hover Box Rect on Scroll or Resize ──
  useEffect(() => {
    if (!editMode || !hoveredEl) return;
    const updateRect = () => {
      if (hoveredEl && document.body.contains(hoveredEl)) {
        setHoverRect(hoveredEl.getBoundingClientRect());
      }
    };
    window.addEventListener("scroll", updateRect, { passive: true });
    window.addEventListener("resize", updateRect);
    return () => {
      window.removeEventListener("scroll", updateRect);
      window.removeEventListener("resize", updateRect);
    };
  }, [editMode, hoveredEl]);

  // ── 3. Update Edit Box Rect on Scroll or Resize ──
  useEffect(() => {
    if (!editMode || !editingEl) return;
    const updateRect = () => {
      if (editingEl && document.body.contains(editingEl)) {
        setEditRect(editingEl.getBoundingClientRect());
      }
    };
    window.addEventListener("scroll", updateRect, { passive: true });
    window.addEventListener("resize", updateRect);
    return () => {
      window.removeEventListener("scroll", updateRect);
      window.removeEventListener("resize", updateRect);
    };
  }, [editMode, editingEl]);

  // ── 4. Global Hover & Click Listeners when in Admin Edit Mode ──
  useEffect(() => {
    if (!isAdmin || !editMode) {
      setHoveredEl(null);
      setHoverRect(null);
      if (editingEl) {
        editingEl.contentEditable = "false";
        editingEl.classList.remove("universal-editing-active");
        setEditingEl(null);
      }
      return;
    }

    const handleMouseOver = (e: MouseEvent) => {
      if (editingEl) return; // Don't change hover while actively typing
      const target = e.target as HTMLElement;
      if (!target) return;

      let el: HTMLElement | null = target;
      while (el && el !== document.body) {
        if (isEditableElement(el)) {
          setHoveredEl(el);
          setHoverRect(el.getBoundingClientRect());
          return;
        }
        el = el.parentElement;
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (editingEl) return;
      if (!e.relatedTarget || e.relatedTarget === document.documentElement) {
        setHoveredEl(null);
        setHoverRect(null);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Ignore clicks on admin UI elements
      if (
        target.closest("[data-admin-ui]") ||
        target.closest("[data-admin-toolbar]") ||
        target.closest("#universal-admin-editor")
      ) {
        return;
      }

      let el: HTMLElement | null = target;
      while (el && el !== document.body) {
        if (isEditableElement(el)) {
          // Prevent standard navigation or form trigger
          e.preventDefault();
          e.stopPropagation();

          // If clicking a different element while editing, cancel previous
          if (editingEl && editingEl !== el) {
            editingEl.innerText = originalValue;
            editingEl.contentEditable = "false";
            editingEl.classList.remove("universal-editing-active");
          }

          const currentText = el.innerText.trim();
          setOriginalValue(currentText);
          setEditingEl(el);
          setEditRect(el.getBoundingClientRect());
          setHoveredEl(null);
          setHoverRect(null);

          el.contentEditable = "true";
          el.spellcheck = false;
          el.classList.add("universal-editing-active");

          // Focus at end
          requestAnimationFrame(() => {
            el?.focus();
            const range = document.createRange();
            const sel = window.getSelection();
            if (el) {
              range.selectNodeContents(el);
              range.collapse(false);
              sel?.removeAllRanges();
              sel?.addRange(range);
            }
          });
          return;
        }
        el = el.parentElement;
      }
    };

    document.addEventListener("mouseover", handleMouseOver, true);
    document.addEventListener("mouseout", handleMouseLeave, true);
    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver, true);
      document.removeEventListener("mouseout", handleMouseLeave, true);
      document.removeEventListener("click", handleClick, true);
    };
  }, [isAdmin, editMode, editingEl, originalValue]);

  // ── 5. Save Current Active Edit ──
  const handleSave = async () => {
    if (!editingEl) return;
    const newText = editingEl.innerText.trim();

    if (newText === originalValue) {
      handleCancel();
      return;
    }

    setSaving(true);
    let blockId = editingEl.getAttribute("data-editable-block");
    if (!blockId) {
      const tag = editingEl.tagName.toLowerCase();
      const slug = slugify(originalValue) || "block";
      const pathHash = hashString(getElementPath(editingEl));
      blockId = `${tag}_${slug}_${pathHash}`;
      editingEl.setAttribute("data-editable-block", blockId);
    }

    const tagLabel = editingEl.tagName.toLowerCase();
    const label = `${tagLabel.toUpperCase()}: "${originalValue.slice(0, 30)}..."`;

    const ok = await saveContent(pageId, blockId, newText, originalValue, label, "text");
    setSaving(false);

    if (ok) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
      editingEl.contentEditable = "false";
      editingEl.classList.remove("universal-editing-active");
      setEditingEl(null);
      setEditRect(null);
      refreshContent();
    }
  };

  // ── 6. Cancel Current Active Edit ──
  const handleCancel = () => {
    if (editingEl) {
      editingEl.innerText = originalValue;
      editingEl.contentEditable = "false";
      editingEl.classList.remove("universal-editing-active");
    }
    setEditingEl(null);
    setEditRect(null);
  };

  // ── 7. Hide/Remove Current Element from Website ──
  const handleHide = async () => {
    const target = editingEl || hoveredEl;
    if (!target) return;

    const confirmed = window.confirm(
      "Are you sure you want to hide this element from visitors? (You can undo this in Changes History)"
    );
    if (!confirmed) return;

    let blockId = target.getAttribute("data-editable-block");
    const currentText = target.innerText?.trim() || "";
    if (!blockId) {
      const tag = target.tagName.toLowerCase();
      const slug = slugify(currentText) || "element";
      const pathHash = hashString(getElementPath(target));
      blockId = `${tag}_${slug}_${pathHash}`;
      target.setAttribute("data-editable-block", blockId);
    }

    const label = `Hidden [${target.tagName.toLowerCase()}]: "${currentText.slice(0, 30)}..."`;

    await saveContent(pageId, blockId, "__hidden__", currentText, label, "hidden");

    target.style.opacity = "0.25";
    target.style.filter = "grayscale(1)";
    target.style.border = "2px dashed #f43f5e";

    handleCancel();
    setHoveredEl(null);
    setHoverRect(null);
    refreshContent();
  };

  // ── 8. Keyboard Shortcuts while Editing (Enter to save, Esc to cancel) ──
  useEffect(() => {
    if (!editingEl) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        const tag = editingEl.tagName.toUpperCase();
        if (["H1", "H2", "H3", "H4", "H5", "H6", "BUTTON", "SPAN", "A", "LABEL"].includes(tag)) {
          e.preventDefault();
          handleSave();
        }
      }
      if (e.key === "Escape") {
        e.preventDefault();
        handleCancel();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [editingEl, originalValue]);

  if (!mounted || !isAdmin || !editMode) return null;

  return createPortal(
    <div id="universal-admin-editor" data-admin-ui="true">
      {/* ── Hover Overlay Box ── */}
      {hoverRect && !editingEl && (
        <div
          style={{
            position: "fixed",
            top: hoverRect.top - 2,
            left: hoverRect.left - 2,
            width: hoverRect.width + 4,
            height: hoverRect.height + 4,
            border: "2px dashed #3b82f6",
            borderRadius: "4px",
            backgroundColor: "rgba(59, 130, 246, 0.08)",
            pointerEvents: "none",
            zIndex: 9980,
            transition: "all 0.08s ease-out",
          }}
        >
          {/* Hover Tag Badge */}
          <div
            style={{
              position: "absolute",
              top: "-24px",
              right: "0px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              pointerEvents: "auto",
            }}
          >
            <span className="flex items-center gap-1 bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded shadow-md whitespace-nowrap">
              <span>{hoveredEl?.tagName.toLowerCase()}</span>
              <span>•</span>
              <span>Click to Edit</span>
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleHide();
              }}
              className="flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-md transition-colors"
              title="Hide this element from visitors"
            >
              <EyeOff className="h-3 w-3" />
              <span>Hide</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Active Edit Action Bar ── */}
      {editRect && editingEl && (
        <div
          style={{
            position: "fixed",
            top: Math.max(10, editRect.top - 38),
            left: editRect.left,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "6px",
            pointerEvents: "auto",
          }}
        >
          <div className="flex items-center gap-1.5 bg-[#0d0e13]/95 border border-white/20 backdrop-blur-xl px-2.5 py-1.5 rounded-xl shadow-[0_12px_36px_rgba(0,0,0,0.6),0_0_15px_rgba(59,130,246,0.3)] text-white text-xs">
            <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded">
              {editingEl.tagName.toLowerCase()}
            </span>

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm transition-all disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              <span>Save</span>
            </button>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-2 py-1 rounded-lg transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              <span>Cancel</span>
            </button>

            {/* Hide Element Button */}
            <button
              type="button"
              onClick={handleHide}
              className="flex items-center gap-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[11px] font-semibold px-2 py-1 rounded-lg transition-colors ml-1"
              title="Remove or hide this card/text from visitors"
            >
              <EyeOff className="h-3 w-3" />
              <span>Hide</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Saved Success Pill ── */}
      {savedSuccess && (
        <div
          style={{
            position: "fixed",
            top: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 99999,
          }}
          className="flex items-center gap-2 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-[0_10px_30px_rgba(16,185,129,0.5)] animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <Check className="h-4 w-4" />
          <span>Change saved successfully to live website!</span>
        </div>
      )}
    </div>,
    document.body
  );
}
