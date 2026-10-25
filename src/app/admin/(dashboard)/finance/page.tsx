import { AdminHeader, AdminCard, EmptyRow } from "@/components/admin/admin-ui";
import { Field, Select, TextArea, UploadField, SubmitBtn, DeleteBtn } from "@/components/admin/form-fields";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { createFinance, deleteFinance } from "@/lib/actions/finance";

export default async function AdminFinancePage() {
  const entries = await db.financeEntry.findMany({ orderBy: { date: "desc" } }).catch(() => []);
  const totalIncome = entries
    .filter((e) => e.kind === "income")
    .reduce((s, e) => s + e.amount, 0);
  const totalExp = entries
    .filter((e) => e.kind === "expenditure")
    .reduce((s, e) => s + e.amount, 0);
  const balance = totalIncome - totalExp;

  return (
    <>
      <AdminHeader
        title="Union Accounts & Finance"
        description="Record verified income allocations and student expenditure vouchers. Totals reflect immediately on the public transparency ledger."
      />

      {/* Summary Metrics */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AdminCard>
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Total Receipts (Inflow)
          </div>
          <div className="mt-1.5 text-2xl font-bold text-emerald-600 font-display">
            ₹{totalIncome.toLocaleString("en-IN")}
          </div>
        </AdminCard>

        <AdminCard>
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Total Disbursed (Outflow)
          </div>
          <div className="mt-1.5 text-2xl font-bold text-red-600 font-display">
            ₹{totalExp.toLocaleString("en-IN")}
          </div>
        </AdminCard>

        <AdminCard>
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Current Treasury Balance
          </div>
          <div className="mt-1.5 text-2xl font-bold text-slate-900 font-display">
            ₹{balance.toLocaleString("en-IN")}
          </div>
        </AdminCard>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        {/* Add Entry Form */}
        <AdminCard>
          <h3 className="mb-4 text-base font-bold text-[var(--text-primary)]">
            Record New Transaction
          </h3>
          <form action={createFinance} className="grid gap-4">
            <Select
              label="Transaction Type"
              name="kind"
              options={[
                { value: "income", label: "Income (Grant / Endowment / Inflow)" },
                { value: "expenditure", label: "Expenditure (Outflow / Disbursed)" },
              ]}
            />
            <Field
              label="Category"
              name="category"
              placeholder="e.g. Cultural Fest, Sports Tournament, Welfare"
              required
            />
            <Field
              label="Voucher Title / Label"
              name="label"
              placeholder="e.g. Stage lighting & PA system rental"
              required
            />
            <Field
              label="Amount (in INR ₹)"
              name="amount"
              type="number"
              placeholder="45000"
              required
            />
            <TextArea
              label="Internal Note / Committee Reference (Optional)"
              name="note"
              rows={2}
              placeholder="Resolution reference number, beneficiary committee..."
            />
            <UploadField
              label="Supporting Voucher / Receipt (Optional)"
              name="receiptUrl"
              accept="application/pdf,image/*"
              hint="PDF invoice or scanned receipt voucher"
            />
            <div className="pt-2">
              <SubmitBtn>Add Transaction Entry</SubmitBtn>
            </div>
          </form>
        </AdminCard>

        {/* Entries List */}
        <div>
          <h3 className="mb-4 text-base font-bold text-[var(--text-primary)]">
            Recorded Ledger ({entries.length})
          </h3>

          {entries.length === 0 ? (
            <EmptyRow>No financial transactions recorded yet.</EmptyRow>
          ) : (
            <div className="space-y-3">
              {entries.map((e) => {
                const isIncome = e.kind === "income";
                return (
                  <div
                    key={e.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-4 shadow-xs"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[var(--text-primary)] break-words leading-snug">
                        {e.label}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                          {e.category}
                        </span>
                        <span>{formatDate(e.date)}</span>
                        {e.receiptUrl && (
                          <span className="text-emerald-700 font-semibold">
                            · Receipt attached
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-[var(--border-primary)] pt-2 sm:border-t-0 sm:pt-0 shrink-0">
                      <span
                        className={`font-mono text-sm font-bold ${
                          isIncome ? "text-emerald-700" : "text-red-600"
                        }`}
                      >
                        {isIncome ? "+" : "−"}₹{e.amount.toLocaleString("en-IN")}
                      </span>
                      <form action={deleteFinance.bind(null, e.id)}>
                        <DeleteBtn label="" />
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
