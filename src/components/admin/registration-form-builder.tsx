"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  ListFilter,
  Type,
  AlignLeft,
  Mail,
  Hash,
  CircleDot,
  CheckSquare,
  Sparkles,
  Info,
  Calendar,
  Clock,
  Phone,
  GraduationCap,
  UserCheck,
  Users,
  UploadCloud,
  Globe,
} from "lucide-react";
import { FieldDefinition } from "@/lib/actions/forms";

interface EventOption {
  id: string;
  title: string;
  date: string;
}

interface FormBuilderProps {
  initialForm?: {
    id: string;
    title: string;
    description: string | null;
    eventId: string | null;
    deadline: Date | null;
    published: boolean;
    fields: FieldDefinition[];
  };
  events: EventOption[];
  action: (formData: FormData) => void;
  deleteAction?: (formData: FormData) => void;
}

export const FIELD_TYPES = [
  { value: "text", label: "Short Answer (Single Line)", icon: Type },
  { value: "textarea", label: "Paragraph (Long Answer)", icon: AlignLeft },
  { value: "date", label: "Date Selection (Calendar Picker)", icon: Calendar },
  { value: "time", label: "Time Selection (Clock Picker)", icon: Clock },
  { value: "datetime-local", label: "Date & Time Combined", icon: Calendar },
  { value: "tel", label: "Phone / WhatsApp Number", icon: Phone },
  { value: "email", label: "Email Address", icon: Mail },
  { value: "number", label: "Number / Quantity / Age", icon: Hash },
  { value: "select", label: "Dropdown Menu", icon: ListFilter },
  { value: "radio", label: "Multiple Choice (Single Option)", icon: CircleDot },
  { value: "checkbox", label: "Checkboxes (Multi-Select)", icon: CheckSquare },
  { value: "batch", label: "Academic Batch / Year (GMC Kozhikode)", icon: GraduationCap },
  { value: "roll_number", label: "Roll No / Student Admission ID", icon: UserCheck },
  { value: "gender", label: "Gender Selection", icon: Users },
  { value: "file", label: "Document / ID / Payment Screenshot", icon: UploadCloud },
  { value: "url", label: "Website / Portfolio / Drive Link", icon: Globe },
  { value: "yes_no", label: "Yes / No Confirmation", icon: CheckCircle2 },
];

export function RegistrationFormBuilder({
  initialForm,
  events,
  action,
  deleteAction,
}: FormBuilderProps) {
  const [fields, setFields] = useState<FieldDefinition[]>(
    initialForm?.fields && initialForm.fields.length > 0
      ? initialForm.fields
      : [
          {
            label: "Full Name",
            type: "text",
            required: true,
            placeholder: "Dr. / Medico Full Name",
          },
          {
            label: "Email Address",
            type: "email",
            required: true,
            placeholder: "name@gmc.edu",
          },
          {
            label: "Batch / Academic Year",
            type: "radio",
            required: true,
            options: "MBBS 2021, MBBS 2022, MBBS 2023, MBBS 2024, MBBS 2025, House Surgeon / Intern, PG Resident",
          },
        ]
  );

  const addField = () => {
    setFields((prev) => [
      ...prev,
      {
        label: `Question ${prev.length + 1}`,
        type: "text",
        required: false,
        placeholder: "",
        options: "",
      },
    ]);
  };

  const removeField = (index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const moveField = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === fields.length - 1)
    ) {
      return;
    }
    const target = direction === "up" ? index - 1 : index + 1;
    const updated = [...fields];
    const [moved] = updated.splice(index, 1);
    updated.splice(target, 0, moved);
    setFields(updated);
  };

  const updateField = (index: number, patch: Partial<FieldDefinition>) => {
    setFields((prev) =>
      prev.map((f, i) => (i === index ? { ...f, ...patch } : f))
    );
  };

  const toDateValue = (d?: Date | null) => {
    if (!d) return "";
    return new Date(d).toISOString().slice(0, 10);
  };

  return (
    <form action={action} className="space-y-8">
      {/* Hidden input to submit fields JSON */}
      <input type="hidden" name="fieldsJson" value={JSON.stringify(fields)} />

      {/* 1. Form Header & Link Event */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Form Settings
          </span>
          <h2 className="text-xl font-display font-bold text-slate-900 mt-1">
            General Configuration
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Form Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              defaultValue={initialForm?.title}
              placeholder="e.g. YUGA Fest 2026 Delegate Pass Registration"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Linked Upcoming Event
            </label>
            <select
              name="eventId"
              defaultValue={initialForm?.eventId || ""}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm font-medium"
            >
              <option value="">-- No Specific Event (Standalone Form) --</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title} ({ev.date})
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500">
              Linking an event powers the interactive Ovio Ticket on the Homepage and Events section.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Description & Instructions
          </label>
          <textarea
            name="description"
            rows={3}
            defaultValue={initialForm?.description || ""}
            placeholder="Instructions for participants regarding eligibility, deadlines, entry passes, and dress code..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm font-medium"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 pt-2">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Registration Deadline (Optional)
            </label>
            <input
              type="date"
              name="deadline"
              defaultValue={toDateValue(initialForm?.deadline)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm font-medium"
            />
          </div>

          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="published"
              name="published"
              defaultChecked={initialForm?.published ?? true}
              className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="published" className="text-sm font-semibold text-slate-900 cursor-pointer">
              Publish & Accept Registrations
            </label>
          </div>
        </div>
      </div>

      {/* 2. Mini Google Form Question Builder */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Question Builder
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                {fields.length} {fields.length === 1 ? "Field" : "Fields"}
              </span>
            </div>
            <h2 className="text-xl font-display font-bold text-slate-900 mt-1">
              Custom Form Fields (Mini Google Form)
            </h2>
          </div>

          <button
            type="button"
            onClick={addField}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Question
          </button>
        </div>

        {/* Informative alert about >3 fields auto-flow */}
        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-start gap-3 text-xs text-slate-700">
          <Info className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-emerald-900">
              Dynamic Ticket & Multi-Step Experience:
            </p>
            <p className="text-slate-600">
              When a form has <strong>3 or fewer fields</strong>, visitors can book their spot directly on the interactive Ovio Ticket card. When there are <strong>more than 3 fields</strong>, visitors enter Name and Email on the ticket and are seamlessly routed to the dedicated registration page with those details pre-filled to complete the rest!
            </p>
          </div>
        </div>

        {/* Question Cards List */}
        <div className="space-y-4">
          {fields.map((field, idx) => {
            const hasOptions = ["radio", "select", "checkbox"].includes(field.type);

            return (
              <div
                key={idx}
                className="group relative rounded-2xl border border-slate-200 bg-slate-50/40 p-5 sm:p-6 transition-all hover:border-emerald-300 hover:shadow-md space-y-4"
              >
                {/* Header: Question Number & Actions */}
                <div className="flex items-center justify-between gap-4 border-b border-slate-200/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-500 uppercase">
                      Field #{idx + 1}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveField(idx, "up")}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === fields.length - 1}
                      onClick={() => moveField(idx, "down")}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeField(idx)}
                      className="p-1 rounded-lg text-rose-500 hover:bg-rose-100 transition-colors ml-2 cursor-pointer"
                      title="Delete Question"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Question Label & Type */}
                <div className="grid gap-4 sm:grid-cols-[1fr_220px]">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      Question Title / Prompt
                    </label>
                    <input
                      type="text"
                      required
                      value={field.label}
                      onChange={(e) => updateField(idx, { label: e.target.value })}
                      placeholder="e.g. Which batch / department are you from?"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      Answer Type
                    </label>
                    <select
                      value={field.type}
                      onChange={(e) => updateField(idx, { type: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    >
                      {FIELD_TYPES.map((ft) => (
                        <option key={ft.value} value={ft.value}>
                          {ft.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Field-specific options & placeholder editor */}
                {hasOptions ? (
                  <div className="space-y-1.5 p-3.5 rounded-xl bg-white border border-slate-200/90">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                        Choices / Options (Separate with commas or new lines)
                      </label>
                      <span className="text-[10px] text-slate-400 font-mono">
                        e.g. Option 1, Option 2, Option 3
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      value={field.options || ""}
                      onChange={(e) => updateField(idx, { options: e.target.value })}
                      placeholder="Choice A, Choice B, Choice C..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>
                ) : field.type === "batch" ? (
                  <div className="space-y-1.5 p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/80">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-900">
                        Academic Batches (GMC Kozhikode Presets)
                      </label>
                      <span className="text-[10px] text-emerald-700 font-semibold">
                        Customizable
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Default: MBBS 2021, MBBS 2022, MBBS 2023, MBBS 2024, MBBS 2025, House Surgeon / Intern, PG Resident, Alumni, Faculty.
                    </p>
                    <textarea
                      rows={2}
                      value={field.options || ""}
                      onChange={(e) => updateField(idx, { options: e.target.value })}
                      placeholder="Leave blank to use default GMC batches, or enter custom batches separated by commas..."
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-emerald-200 bg-white font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>
                ) : field.type === "gender" ? (
                  <div className="p-3 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                    <Users className="h-4 w-4 text-emerald-700 shrink-0" />
                    <span>Preset options: <strong>Male</strong>, <strong>Female</strong>, <strong>Other</strong>, <strong>Prefer not to say</strong></span>
                  </div>
                ) : field.type === "yes_no" ? (
                  <div className="p-3 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
                    <span>Preset binary choices: <strong>Yes</strong> / <strong>No</strong> confirmation buttons</span>
                  </div>
                ) : field.type === "date" || field.type === "time" || field.type === "datetime-local" ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                        Help Hint / Description (Optional)
                      </label>
                      <span className="text-[10px] text-emerald-700 font-medium">
                        Renders native {field.type === "date" ? "calendar date picker" : field.type === "time" ? "time picker" : "date & time picker"}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={field.placeholder || ""}
                      onChange={(e) => updateField(idx, { placeholder: e.target.value })}
                      placeholder={`e.g. Choose your ${field.type === "date" ? "date of birth or attendance date" : "slot time"}...`}
                      className="w-full px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>
                ) : field.type === "file" ? (
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      Upload Prompt / Instructions
                    </label>
                    <input
                      type="text"
                      value={field.placeholder || ""}
                      onChange={(e) => updateField(idx, { placeholder: e.target.value })}
                      placeholder="e.g. Attach payment screenshot, college ID, or document link..."
                      className="w-full px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Placeholder Text (Optional)
                    </label>
                    <input
                      type="text"
                      value={field.placeholder || ""}
                      onChange={(e) => updateField(idx, { placeholder: e.target.value })}
                      placeholder="Hint shown inside the input box..."
                      className="w-full px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>
                )}

                {/* Bottom Toggle: Required */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id={`required-${idx}`}
                    checked={field.required}
                    onChange={(e) => updateField(idx, { required: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <label
                    htmlFor={`required-${idx}`}
                    className="text-xs font-semibold text-slate-700 cursor-pointer select-none"
                  >
                    Required Question
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={addField}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/40 text-slate-600 hover:text-emerald-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Another Question
          </button>
        </div>
      </div>

      {/* 3. Form Action Buttons */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            {initialForm ? "Save Changes" : "Create Registration Form"}
          </button>
          <Link
            href="/admin/forms"
            className="px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </Link>
        </div>

        {initialForm && deleteAction && (
          <button
            type="submit"
            formAction={deleteAction}
            onClick={(e) => {
              if (!confirm("Are you sure you want to delete this registration form and all its submissions?")) {
                e.preventDefault();
              }
            }}
            className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
          >
            Delete Form
          </button>
        )}
      </div>
    </form>
  );
}
