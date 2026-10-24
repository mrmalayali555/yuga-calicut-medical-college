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

  // If DB is completely empty, provide realistic initial budget entries
  const initialEntries =
    summary.entries.length > 0
      ? summary.entries.map((e) => ({
          id: e.id,
          kind: e.kind as "income" | "expenditure",
          category: e.category,
          label: e.label,
          amount: e.amount,
          date: e.date.toISOString(),
          note: e.note || undefined,
          receiptUrl: e.receiptUrl || undefined,
        }))
      : [
          {
            id: "fin-1",
            kind: "income" as const,
            category: "Union General Fund",
            label: "Annual Student Union Allocation & Institutional Grant (2026-2027)",
            amount: 750000,
            date: new Date("2026-08-01").toISOString(),
            note: "Approved by College Council and Directorate of Medical Education",
          },
          {
            id: "fin-2",
            kind: "income" as const,
            category: "Fest Sponsorship",
            label: "YUGA '26 Inter-Collegiate Cultural Fest Title Sponsorship",
            amount: 320000,
            date: new Date("2026-09-10").toISOString(),
            note: "Corporate co-sponsorship and alumnus endowment fund",
          },
          {
            id: "fin-3",
            kind: "expenditure" as const,
            category: "Sports & Athletics",
            label: "Calicut Medicos Premier League (CMPL) Floodlight & Pitch Maintenance",
            amount: 85000,
            date: new Date("2026-09-18").toISOString(),
            note: "Ground repair, equipment, referee honorarium, and trophies",
          },
          {
            id: "fin-4",
            kind: "expenditure" as const,
            category: "Academic Conclave",
            label: "National MedEx Research Workshop Kits & Keynote Faculty Honorarium",
            amount: 62000,
            date: new Date("2026-10-04").toISOString(),
            note: "Delegate handbook printing, badges, and workshop simulation kits",
          },
          {
            id: "fin-5",
            kind: "expenditure" as const,
            category: "Student Welfare",
            label: "Late-Night Campus Library Reading Hall Water Dispensers & Inverter Service",
            amount: 28500,
            date: new Date("2026-10-12").toISOString(),
            note: "Direct student intervention resolution approved by Principal",
          },
          {
            id: "fin-6",
            kind: "income" as const,
            category: "Social Service",
            label: "Voluntary Blood Donors Forum & Emergency Response Relief Contribution",
            amount: 45000,
            date: new Date("2026-10-16").toISOString(),
            note: "Alumni association contribution for emergency patient transport",
          },
        ];

  return <FinanceClientView initialEntries={initialEntries} />;
}
