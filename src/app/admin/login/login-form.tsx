"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, LogIn, AlertCircle } from "lucide-react";
import { loginAction, type LoginState } from "@/lib/actions/auth";

export function LoginForm() {
  const [state, formAction] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="off"
          required
          placeholder="admin@yuga.local"
          className="w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-elevated)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className="w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-elevated)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
        />
      </div>

      {state.error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60 shadow-lg"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> Verifying Credentials…
        </>
      ) : (
        <>
          <LogIn className="h-4 w-4" /> Sign In to YUGA Console
        </>
      )}
    </button>
  );
}
