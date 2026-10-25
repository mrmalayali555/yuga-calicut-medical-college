import { requireAdmin } from "@/lib/require-admin";
import { ChangesHistoryClient } from "./changes-client";

export default async function ChangesHistoryPage() {
  await requireAdmin();
  return <ChangesHistoryClient />;
}
