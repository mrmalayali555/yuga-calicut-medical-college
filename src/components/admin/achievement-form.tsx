"use client";

import Link from "next/link";
import { Field, TextArea, Select, Toggle, UploadField, SubmitBtn, DeleteBtn } from "./form-fields";

type Data = {
  title: string;
  category: string;
  description: string;
  date: Date;
  coverImage: string | null;
  awardWinner?: string | null;
  published: boolean;
};

function toDateInput(d: Date) {
  return new Date(d).toISOString().slice(0, 10);
}

export function AchievementForm({
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
            placeholder="All Kerala Inter-Medics Football Champions 2026"
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Select
              label="Category"
              name="category"
              defaultValue={item?.category ?? "sports"}
              options={[
                { value: "sports", label: "Sports" },
                { value: "arts", label: "Arts & Culture" },
                { value: "academics", label: "Academics & Research" },
                { value: "general", label: "General" },
              ]}
            />
            <Field
              label="Date"
              name="date"
              type="date"
              defaultValue={item ? toDateInput(item.date) : new Date().toISOString().slice(0, 10)}
              required
            />
          </div>
          <Field
            label="Winner / Team (optional)"
            name="awardWinner"
            defaultValue={item?.awardWinner ?? ""}
            placeholder="e.g. 2022 Batch (The Spartans)"
          />
          <TextArea
            label="Description"
            name="description"
            defaultValue={item?.description}
            required
            rows={5}
            placeholder="Details of the victory, team members, awards won..."
          />
          <UploadField
            label="Cover image"
            name="coverImage"
            defaultUrl={item?.coverImage}
            accept="image/*"
            hint="JPG, PNG, WebP up to 8MB"
          />
          <Toggle
            label="Published"
            name="published"
            defaultChecked={item?.published ?? true}
            hint="Show on public site"
          />
        </div>

        <div className="flex items-center gap-3">
          <SubmitBtn>{item ? "Save changes" : "Create achievement"}</SubmitBtn>
          <Link
            href="/admin/achievements"
            className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            Cancel
          </Link>
        </div>
      </form>

      {item && deleteAction && (
        <form action={deleteAction} className="border-t border-[var(--border-primary)] pt-6">
          <DeleteBtn label="Delete achievement" />
        </form>
      )}
    </div>
  );
}
