import { Metadata } from "next";
import { getFinanceSummary } from "@/lib/queries";
import { COLLEGE, YUGA } from "@/lib/site";
import { FinanceClientView } from "./finance-client";

export const metadata: Metadata = {
  title: "Union Accounts & Financial Transparency · YUGA",
  description:
    "Official financial accounts and budget statement for YUGA College Union 2026-2027 at Government Medical College, Kozhikode. Transparent ledger of union income and campus expenditures.",
};

export default async function FinancePage() {
  const summary = await getFinanceSummary();

  const initialEntries = summary.entries.map((e) => ({
    id: e.id,
    kind: e.kind as "income" | "expenditure",
    category: e.category,
    label: e.label,
    amount: e.amount,
    date: e.date.toISOString(),
    note: e.note || undefined,
    receiptUrl: e.receiptUrl || undefined,
  }));

  return <FinanceClientView initialEntries={initialEntries} />;
}
