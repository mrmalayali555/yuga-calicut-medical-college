"use client";

import { useState } from "react";
import Link from "next/link";
import { Field, TextArea, Select, Toggle, UploadField, SubmitBtn, DeleteBtn } from "./form-fields";

type EventData = {
  id: string;
  title: string;
  description: string;
  date: Date;
  endDate: Date | null;
  time: string | null;
  venue: string | null;
  poster: string | null;
  status: string;
  published: boolean;
};

function toDateInput(d: Date) {
  return new Date(d).toISOString().slice(0, 10);
}

export function EventForm({
  event,
  forms = [],
  currentFormId,
  action,
  deleteAction,
}: {
  event?: EventData;
  forms?: { id: string; title: string }[];
  currentFormId?: string | null;
  action: (formData: FormData) => void;
  deleteAction?: (formData: FormData) => void;
}) {
  const [hasReg, setHasReg] = useState(Boolean(currentFormId));

  return (
    <div className="space-y-6">
      <form action={action} className="space-y-6">
        <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 space-y-5">
          <Field
            label="Title"
            name="title"
            defaultValue={event?.title}
            required
            placeholder="YUGA Annual Sports Meet 2026"
          />
          <TextArea
            label="Description"
            name="description"
            defaultValue={event?.description}
            required
            rows={5}
            placeholder="Describe the event, rules, schedule and participants..."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Start Date"
              name="date"
              type="date"
              defaultValue={event ? toDateInput(event.date) : ""}
              required
            />
            <Field
              label="End Date (optional)"
              name="endDate"
              type="date"
              defaultValue={event?.endDate ? toDateInput(event.endDate) : ""}
              hint="Leave blank for single-day events"
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Time" name="time" defaultValue={event?.time ?? ""} placeholder="5:00 PM" />
            <Field label="Venue" name="venue" defaultValue={event?.venue ?? ""} placeholder="Main Ground / College Auditorium" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Select
              label="Status"
              name="status"
              defaultValue={event?.status ?? "upcoming"}
              options={[
                { value: "upcoming", label: "Upcoming" },
                { value: "completed", label: "Completed" },
                { value: "cancelled", label: "Cancelled" },
              ]}
            />
          </div>

          <UploadField
            label="Poster"
            name="poster"
            defaultUrl={event?.poster}
            accept="image/*"
            hint="JPG, PNG, WebP up to 8MB"
          />

          {/* Registration Requirement Toggle */}
          <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Require Delegate Registration Pass?
                </span>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  If disabled, this event will be published as an <strong>Announcement Only</strong> with no entry pass required.
                </p>
              </div>
              <input type="hidden" name="requiresRegistration" value={hasReg ? "true" : "false"} />
              <button
                type="button"
                onClick={() => setHasReg(!hasReg)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  hasReg ? "bg-[var(--accent)]" : "bg-[var(--border-primary)]"
                }`}
                aria-pressed={hasReg}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                    hasReg ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>

            {hasReg && (
              <div className="pt-2 border-t border-[var(--border-subtle)] space-y-2">
                <label className="block text-xs font-semibold text-[var(--text-secondary)]">
                  Attached Registration Form
                </label>
                <select
                  name="registrationFormId"
                  defaultValue={currentFormId || (forms.length > 0 ? forms[0].id : "create_default")}
                  className="w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] px-4 py-2.5 text-xs text-[var(--text-primary)] outline-none"
                >
                  <option value="create_default">
                    Auto-create standard delegate entry pass form
                  </option>
                  {forms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.title}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[var(--text-faint)]">
                  You can design custom questions, batches, and fields in the{" "}
                  <Link href="/admin/forms" className="text-[var(--accent)] underline" target="_blank">
                    Registration Forms Builder
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>

          <Toggle
            label="Published"
            name="published"
            defaultChecked={event?.published ?? true}
            hint="Show publicly on YUGA website"
          />
        </div>

        <div className="flex items-center gap-3">
          <SubmitBtn>{event ? "Save changes" : "Create event"}</SubmitBtn>
          <Link
            href="/admin/events"
            className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            Cancel
          </Link>
        </div>
      </form>

      {event && deleteAction && (
        <form action={deleteAction} className="border-t border-[var(--border-primary)] pt-6">
          <DeleteBtn label="Delete event" />
        </form>
      )}
    </div>
  );
}
