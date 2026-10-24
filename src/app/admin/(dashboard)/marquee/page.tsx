import { AdminHeader } from "@/components/admin/admin-ui";
import { Field, TextArea, Toggle, SubmitBtn } from "@/components/admin/form-fields";
import { db } from "@/lib/db";
import { saveMarquee } from "@/lib/actions/marquee";

export default async function AdminMarqueePage() {
  const marquee = await db.marquee.findFirst({ orderBy: { updatedAt: "desc" } });

  return (
    <>
      <AdminHeader
        title="Live Marquee Bar"
        description="Configure the top broadcast ticker displayed across all visitor pages."
      />
      <form action={saveMarquee} className="space-y-6">
        <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 space-y-5">
          <Toggle
            label="Enable Marquee Ticker"
            name="enabled"
            defaultChecked={marquee?.enabled ?? true}
            hint="Display or hide the real-time announcement ticker"
          />
          <TextArea
            label="Ticker Headline"
            name="text"
            defaultValue={marquee?.text}
            required
            rows={2}
            placeholder="YUGA Central Union: Registration open for Inter-Medical Youth Festival 2026..."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Action Button Label (optional)"
              name="buttonText"
              defaultValue={marquee?.buttonText ?? ""}
              placeholder="e.g. Register Now / Read More"
            />
            <Field
              label="Action Link (optional)"
              name="buttonUrl"
              defaultValue={marquee?.buttonUrl ?? ""}
              placeholder="e.g. /events or https://..."
            />
          </div>
        </div>
        <SubmitBtn>Save marquee</SubmitBtn>
      </form>
    </>
  );
}
