"use client";

import Link from "next/link";
import { Field, TextArea, Toggle, UploadField, SubmitBtn, DeleteBtn } from "./form-fields";

type Data = {
  title: string;
  description: string;
  date: Date;
  image: string | null;
  pdfUrl: string | null;
  published: boolean;
};

function toDateInput(d: Date) {
  return new Date(d).toISOString().slice(0, 10);
}

export function NotificationForm({
  item,
  action,
  deleteAction,
}: {
  item?: Data;
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
            defaultValue={item?.title}
            required
            placeholder="Official Circular: KUHS Examination Timetable Released"
          />
          <Field
            label="Date"
            name="date"
            type="date"
            defaultValue={item ? toDateInput(item.date) : new Date().toISOString().slice(0, 10)}
            required
          />
          <TextArea
            label="Description"
            name="description"
            defaultValue={item?.description}
            required
            rows={5}
            placeholder="Full notification contents or summary of circular..."
          />
          <UploadField
            label="Official Document / PDF"
            name="pdfUrl"
            defaultUrl={item?.pdfUrl}
            accept="application/pdf"
            hint="PDF up to 20MB"
          />
          <UploadField
            label="Banner / Notice Photo (optional)"
            name="image"
            defaultUrl={item?.image}
            accept="image/*"
            hint="JPG, PNG, WebP up to 8MB"
          />
          <Toggle
            label="Published"
            name="published"
            defaultChecked={item?.published ?? true}
            hint="Display on circulars & announcements feed"
          />
        </div>

        <div className="flex items-center gap-3">
          <SubmitBtn>{item ? "Save changes" : "Post notification"}</SubmitBtn>
          <Link
            href="/admin/notifications"
            className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            Cancel
          </Link>
        </div>
      </form>

      {item && deleteAction && (
        <form action={deleteAction} className="border-t border-[var(--border-primary)] pt-6">
          <DeleteBtn label="Delete notification" />
        </form>
      )}
    </div>
  );
}
