"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

/* ───────────────────────────── Types ───────────────────────────── */

interface AdminInfo {
  isAdmin: boolean;
  name: string;
  email: string;
  role: string;
  id: string;
}

interface AdminEditContextType {
  /** Whether the current visitor is a logged-in admin */
  isAdmin: boolean;
  adminInfo: AdminInfo | null;
  /** Whether edit mode is toggled on */
  editMode: boolean;
  toggleEditMode: () => void;
  /** Look up a DB content override for a given block */
  getContent: (pageId: string, blockId: string) => string | null;
  /** Save a content change via the API */
  saveContent: (
    pageId: string,
    blockId: string,
    newValue: string,
    oldValue: string,
    label?: string,
    type?: string
  ) => Promise<boolean>;
  /** Refresh content blocks for the current page */
  refreshContent: () => void;
}

const AdminEditContext = createContext<AdminEditContextType>({
  isAdmin: false,
  adminInfo: null,
  editMode: false,
  toggleEditMode: () => {},
  getContent: () => null,
  saveContent: async () => false,
  refreshContent: () => {},
});

/* ─────────────────────── Helper: page ID ─────────────────────── */

function pathnameToPageId(pathname: string): string {
  if (pathname === "/") return "home";
  return pathname.replace(/^\//, "").replace(/\//g, "-");
}

/* ──────────────────────── Provider ──────────────────────── */

export function AdminEditProvider({ children }: { children: ReactNode }) {
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [contentMap, setContentMap] = useState<Record<string, string>>({});
  const [checkedAdmin, setCheckedAdmin] = useState(false);
  const pathname = usePathname();

  // ── Check admin status on mount ──
  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/check")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.isAdmin) {
          setAdminInfo({
            isAdmin: true,
            name: data.name,
            email: data.email,
            role: data.role,
            id: data.id,
          });
        } else {
          setAdminInfo(null);
        }
        setCheckedAdmin(true);
      })
      .catch(() => {
        if (!cancelled) {
          setAdminInfo(null);
          setCheckedAdmin(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Fetch content blocks for the current page ──
  const fetchContent = useCallback(() => {
    // Don't fetch content for admin pages
    if (pathname.startsWith("/admin")) return;
    const pageId = pathnameToPageId(pathname);
    fetch(`/api/content?page=${pageId}`)
      .then((res) => res.json())
      .then((data) => {
        const map: Record<string, string> = {};
        for (const block of data.blocks || []) {
          map[`${block.pageId}::${block.blockId}`] = block.content;
        }
        setContentMap((prev) => ({ ...prev, ...map }));
      })
      .catch(() => {});
  }, [pathname]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // ── Turn off edit mode when navigating to admin pages ──
  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      setEditMode(false);
    }
  }, [pathname]);

  // ── Get content for a block ──
  const getContent = useCallback(
    (pageId: string, blockId: string) => {
      const resolvedPageId =
        pageId === "auto" ? pathnameToPageId(pathname) : pageId;
      return contentMap[`${resolvedPageId}::${blockId}`] ?? null;
    },
    [contentMap, pathname]
  );

  // ── Save content for a block ──
  const saveContent = useCallback(
    async (
      pageId: string,
      blockId: string,
      newValue: string,
      oldValue: string,
      label?: string,
      type?: string
    ): Promise<boolean> => {
      const resolvedPageId =
        pageId === "auto" ? pathnameToPageId(pathname) : pageId;

      try {
        const res = await fetch("/api/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pageId: resolvedPageId,
            blockId,
            content: newValue,
            previousValue: oldValue,
            label: label || blockId,
            pageName: resolvedPageId,
            type: type || "text",
          }),
        });

        if (res.ok) {
          setContentMap((prev) => ({
            ...prev,
            [`${resolvedPageId}::${blockId}`]: newValue,
          }));
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    [pathname]
  );

  const isAdmin = checkedAdmin && adminInfo?.isAdmin === true;

  return (
    <AdminEditContext.Provider
      value={{
        isAdmin,
        adminInfo,
        editMode,
        toggleEditMode: () => setEditMode((prev) => !prev),
        getContent,
        saveContent,
        refreshContent: fetchContent,
      }}
    >
      {children}
    </AdminEditContext.Provider>
  );
}

export const useAdminEdit = () => useContext(AdminEditContext);
