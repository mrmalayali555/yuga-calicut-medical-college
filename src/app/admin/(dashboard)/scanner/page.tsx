import { Metadata } from "next";
import { requireAdmin } from "@/lib/require-admin";
import { getAttendanceData } from "@/lib/actions/attendance";
import { AttendanceScannerView } from "@/components/admin/attendance-scanner-view";

export const metadata: Metadata = {
  title: "QR Entry Scanner & Attendance",
  description: "Official real-time event entry QR scanner and attendance verification counter for YUGA College Union.",
};

export const dynamic = "force-dynamic";

export default async function AdminScannerPage() {
  const admin = await requireAdmin();
  const data = await getAttendanceData();

  return <AttendanceScannerView initialData={data} adminName={admin.name} />;
}
