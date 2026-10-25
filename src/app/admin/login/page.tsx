import { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[var(--bg-main)] px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-[var(--accent)] opacity-10 blur-[130px]" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-3 backdrop-blur shadow-2xl">
            <Image
              src="/yuga-logo-emerald.png"
              alt="YUGA Emblem"
              width={64}
              height={64}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-[var(--text-primary)]">YUGA Admin Portal</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Calicut Medical College Union Command Center</p>
        </div>

        <div className="rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 backdrop-blur-xl sm:p-8 shadow-2xl">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
          Authorised college union executive personnel only.
        </p>
      </div>
    </main>
  );
}
