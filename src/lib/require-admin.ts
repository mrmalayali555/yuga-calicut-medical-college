import "server-only";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSession, type SessionPayload } from "./auth";

/** Use in admin server components / actions. Redirects to login if not authed. */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    const store = await cookies();
    if (store.has("yuga_session")) {
      redirect("/admin/login?clear_session=1");
    }
    redirect("/admin/login");
  }
  return session;
}
