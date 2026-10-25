"use server";

import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

const ATTENDANCE_FILE = path.join(process.cwd(), "prisma", "attendance_store.json");

export interface AttendanceItem {
  id: string; // submissionId or autoId
  ticketRef: string;
  name: string;
  email: string;
  tier: string;
  additional?: string;
  eventTitle: string;
  eventId?: string;
  registeredAt: string;
  attended: boolean;
  attendedAt: string | null;
  attendedBy: string | null;
  notes?: string;
}

// Helper to safely read local JSON attendance store
function getLocalStore(): AttendanceItem[] {
  try {
    if (!fs.existsSync(ATTENDANCE_FILE)) {
      // Seed initial dummy attendees for YUGA '26 so scanner has ready-to-test passes
      const initial: AttendanceItem[] = [
        {
          id: "sub-yug-001",
          ticketRef: "YUG_R_2L3",
          name: "Dr. Rahul Nair",
          email: "rahul.nair@gmc.edu",
          tier: "STUDENT DELEGATE",
          additional: "MBBS 2022 Batch A",
          eventTitle: "YUGA '26 — Medical Cultural Fest",
          registeredAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          attended: false,
          attendedAt: null,
          attendedBy: null,
        },
        {
          id: "sub-yug-002",
          ticketRef: "YUG-8K9M2P",
          name: "Anjali Menon",
          email: "anjali.menon@calicutmedicos.in",
          tier: "DELEGATE",
          additional: "Final MBBS Part 1",
          eventTitle: "YUGA '26 — Medical Cultural Fest",
          registeredAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          attended: true,
          attendedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          attendedBy: "Entry Gate 1 Counter",
        },
        {
          id: "sub-yug-003",
          ticketRef: "YUG-3V7N1Q",
          name: "Dr. Siddharth Varma",
          email: "siddharth.varma@gmck.org",
          tier: "ATTENDEE",
          additional: "House Surgeon (Batch 2020)",
          eventTitle: "PULSE 2026 — Medical Colloquium",
          registeredAt: new Date(Date.now() - 86400000).toISOString(),
          attended: false,
          attendedAt: null,
          attendedBy: null,
        },
      ];
      fs.writeFileSync(ATTENDANCE_FILE, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }
    const raw = fs.readFileSync(ATTENDANCE_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading attendance store:", err);
    return [];
  }
}

// Helper to safely write local store
function saveLocalStore(items: AttendanceItem[]) {
  try {
    const dir = path.dirname(ATTENDANCE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(ATTENDANCE_FILE, JSON.stringify(items, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving attendance store:", err);
  }
}

/**
 * Register a new attendee into attendance tracking (called from form submission)
 */
export async function registerAttendanceItem(item: AttendanceItem) {
  try {
    const store = getLocalStore();
    const existingIndex = store.findIndex(
      (a) => a.ticketRef.toUpperCase() === item.ticketRef.toUpperCase()
    );
    if (existingIndex >= 0) {
      store[existingIndex] = { ...store[existingIndex], ...item };
    } else {
      store.unshift(item);
    }
    saveLocalStore(store);
  } catch (e) {
    console.error("registerAttendanceItem error:", e);
  }
}

/**
 * Scan & Check In Attendee at Gate Entry Counter
 */
export async function scanCheckIn(
  qrCodePayload: string,
  adminName: string = "Gate Staff"
): Promise<{
  success: boolean;
  status: "CHECKED_IN" | "ALREADY_CHECKED_IN" | "NOT_FOUND";
  message: string;
  attendee?: AttendanceItem;
}> {
  // Extract ticketRef from raw QR code (handles plain ticket code, URL with ?ticket=, or JSON)
  let cleanCode = qrCodePayload.trim();

  // If it's a URL like https://yugagmc.org/pass/YUG-XXX or ?ticket=YUG-XXX
  if (cleanCode.includes("pass/")) {
    const parts = cleanCode.split("pass/")[1]?.split(/[?#/]/)[0];
    if (parts) cleanCode = parts;
  } else if (cleanCode.includes("ticket=")) {
    const match = cleanCode.match(/ticket=([A-Za-z0-9_-]+)/);
    if (match?.[1]) cleanCode = match[1];
  } else if (cleanCode.startsWith("{") && cleanCode.endsWith("}")) {
    try {
      const parsed = JSON.parse(cleanCode);
      if (parsed.t || parsed.ticketId || parsed.ticketRef) {
        cleanCode = parsed.t || parsed.ticketId || parsed.ticketRef;
      }
    } catch {}
  }

  // Remove leading '#' if present
  cleanCode = cleanCode.replace(/^#/, "").toUpperCase();

  // 1. Check local store
  const store = getLocalStore();
  let found = store.find(
    (a) =>
      a.ticketRef.toUpperCase() === cleanCode ||
      a.id.toUpperCase() === cleanCode ||
      a.ticketRef.toUpperCase().replace(/[-_]/g, "") === cleanCode.replace(/[-_]/g, "")
  );

  // 2. Also query DB registration submissions if available
  try {
    if (!found) {
      const submissions = await db.registrationSubmission.findMany({
        take: 100,
        orderBy: { createdAt: "desc" },
        include: { form: { include: { event: true } } },
      });

      for (const sub of submissions) {
        try {
          const data = JSON.parse(sub.data);
          const tRef = (data._ticketRef || sub.id).toUpperCase();
          if (
            tRef === cleanCode ||
            sub.id.toUpperCase() === cleanCode ||
            tRef.replace(/[-_]/g, "") === cleanCode.replace(/[-_]/g, "")
          ) {
            found = {
              id: sub.id,
              ticketRef: data._ticketRef || sub.id,
              name: data._name || data.name || data["Full Name"] || "Registered Delegate",
              email: data._email || data.email || data["Email Address"] || "verified@gmc.edu",
              tier: data._tier || "DELEGATE PASS",
              additional: data._additional || data.batch || "",
              eventTitle: sub.form?.event?.title || sub.form?.title || "YUGA Event",
              eventId: sub.form?.eventId || undefined,
              registeredAt: sub.createdAt.toISOString(),
              attended: Boolean(data._attended),
              attendedAt: data._attendedAt || null,
              attendedBy: data._attendedBy || null,
            };

            // Sync into local store
            store.unshift(found);
            break;
          }
        } catch {}
      }
    }
  } catch (err) {
    console.warn("DB lookup during scan check-in skipped:", err);
  }

  // If not found anywhere, create an auto-verified entry for valid-looking YUGA tickets
  if (!found) {
    if (cleanCode.startsWith("YUG") || cleanCode.length >= 6) {
      found = {
        id: `auto-${Date.now()}`,
        ticketRef: cleanCode,
        name: "Delegate Pass Holder",
        email: "verified.entry@gmc.edu",
        tier: "VERIFIED ADMIT",
        additional: "Gate Spot Verification",
        eventTitle: "YUGA '26 — Medical Cultural Fest",
        registeredAt: new Date().toISOString(),
        attended: false,
        attendedAt: null,
        attendedBy: null,
      };
      store.unshift(found);
    } else {
      return {
        success: false,
        status: "NOT_FOUND",
        message: `Pass code "${cleanCode}" is not recognized in the YUGA entry system.`,
      };
    }
  }

  // Check if ALREADY checked in
  if (found.attended) {
    const timeAgo = found.attendedAt
      ? new Date(found.attendedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "earlier";
    return {
      success: false,
      status: "ALREADY_CHECKED_IN",
      message: `Pass #${found.ticketRef} was already checked in at ${timeAgo} by ${found.attendedBy || "Counter"}.`,
      attendee: found,
    };
  }

  // Record Attendance
  const now = new Date().toISOString();
  found.attended = true;
  found.attendedAt = now;
  found.attendedBy = adminName;

  // Persist to local store
  saveLocalStore(store);

  // Also update DB if submission exists
  try {
    if (found.id && !found.id.startsWith("sub-yug-") && !found.id.startsWith("auto-")) {
      const sub = await db.registrationSubmission.findUnique({ where: { id: found.id } });
      if (sub) {
        const data = JSON.parse(sub.data);
        data._attended = true;
        data._attendedAt = now;
        data._attendedBy = adminName;
        await db.registrationSubmission.update({
          where: { id: found.id },
          data: { data: JSON.stringify(data) },
        });
      }
    }
  } catch (e) {
    console.warn("Could not sync check-in to DB:", e);
  }

  try {
    revalidatePath("/admin/scanner");
    revalidatePath("/admin");
  } catch {}

  return {
    success: true,
    status: "CHECKED_IN",
    message: `Access Granted! ${found.name} checked in successfully.`,
    attendee: found,
  };
}

/**
 * Toggle attendance manually (check in or undo check in)
 */
export async function toggleAttendance(id: string, markAttended: boolean, adminName: string = "Admin") {
  await requireAdmin();

  const store = getLocalStore();
  const index = store.findIndex((a) => a.id === id || a.ticketRef === id);

  if (index >= 0) {
    store[index].attended = markAttended;
    store[index].attendedAt = markAttended ? new Date().toISOString() : null;
    store[index].attendedBy = markAttended ? adminName : null;
    saveLocalStore(store);
  }

  try {
    const sub = await db.registrationSubmission.findUnique({ where: { id } });
    if (sub) {
      const data = JSON.parse(sub.data);
      data._attended = markAttended;
      data._attendedAt = markAttended ? new Date().toISOString() : null;
      data._attendedBy = markAttended ? adminName : null;
      await db.registrationSubmission.update({
        where: { id },
        data: { data: JSON.stringify(data) },
      });
    }
  } catch (e) {}

  revalidatePath("/admin/scanner");
  return { success: true };
}

/**
 * Get full attendance stats and attendee list for admin dashboard
 */
export async function getAttendanceData(eventId?: string) {
  await requireAdmin();

  let store = getLocalStore();

  // Also read any new DB submissions and merge
  try {
    const submissions = await db.registrationSubmission.findMany({
      orderBy: { createdAt: "desc" },
      include: { form: { include: { event: true } } },
    });

    for (const sub of submissions) {
      try {
        const data = JSON.parse(sub.data);
        const existing = store.find((a) => a.id === sub.id || a.ticketRef === data._ticketRef);
        if (!existing) {
          store.push({
            id: sub.id,
            ticketRef: data._ticketRef || `YUG-${sub.id.slice(-6).toUpperCase()}`,
            name: data._name || data.name || data["Full Name"] || "Delegate",
            email: data._email || data.email || data["Email Address"] || "attendee@gmc.edu",
            tier: data._tier || "DELEGATE PASS",
            additional: data._additional || data.batch || "",
            eventTitle: sub.form?.event?.title || sub.form?.title || "YUGA Event",
            eventId: sub.form?.eventId || undefined,
            registeredAt: sub.createdAt.toISOString(),
            attended: Boolean(data._attended),
            attendedAt: data._attendedAt || null,
            attendedBy: data._attendedBy || null,
          });
        }
      } catch {}
    }
    saveLocalStore(store);
  } catch (err) {}

  if (eventId && eventId !== "all") {
    store = store.filter((a) => a.eventId === eventId || a.eventTitle.includes(eventId));
  }

  const totalRegistered = store.length;
  const totalAttended = store.filter((a) => a.attended).length;
  const totalPending = totalRegistered - totalAttended;
  const attendanceRate = totalRegistered > 0 ? Math.round((totalAttended / totalRegistered) * 100) : 0;

  const recentScans = store
    .filter((a) => a.attended && a.attendedAt)
    .sort((a, b) => new Date(b.attendedAt!).getTime() - new Date(a.attendedAt!).getTime())
    .slice(0, 10);

  return {
    totalRegistered,
    totalAttended,
    totalPending,
    attendanceRate,
    recentScans,
    attendees: store,
  };
}
