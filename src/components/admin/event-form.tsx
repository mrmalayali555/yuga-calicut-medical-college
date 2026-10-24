"use client";

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
  action,
  deleteAction,
}: {
  event?: EventData;
  action: (formData: FormData) => void;
  deleteAction?: (formData: FormData) => void;
}) {
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
