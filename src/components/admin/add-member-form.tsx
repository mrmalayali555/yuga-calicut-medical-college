"use client";

import { useRef, useState } from "react";
import { Field, UploadField, SubmitBtn } from "@/components/admin/form-fields";
import { addMember } from "@/lib/actions/committees";

export function AddMemberForm({ committeeId }: { committeeId: string }) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [photoKey, setPhotoKey] = useState(0);

  const handleSubmit = async (formData: FormData) => {
    await addMember(committeeId, formData);
    formRef.current?.reset();
    setPhotoKey((k) => k + 1);
  };

  return (
    <details className="mt-4 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-elevated)] p-4">
      <summary className="cursor-pointer text-sm font-semibold text-[var(--accent)] hover:opacity-80">
        + Add New Member
      </summary>
      <form
        ref={formRef}
        action={handleSubmit}
        className="mt-4 grid gap-4 sm:grid-cols-2"
      >
        <Field label="Name" name="name" required placeholder="Dr. / Student name" />
        <Field label="Position" name="position" placeholder="Convenor / Joint Convenor / Member" />
        <Field label="Contact" name="contact" placeholder="Phone or email" />
        <Field label="Order" name="order" type="number" defaultValue={0} />
        <div className="sm:col-span-2">
          <UploadField
            key={photoKey}
            label="Profile Photo"
            name="photo"
            accept="image/*"
            hint="JPG, PNG, WebP up to 8MB"
          />
        </div>
        <div className="sm:col-span-2">
          <SubmitBtn>Add member</SubmitBtn>
        </div>
      </form>
    </details>
  );
}
