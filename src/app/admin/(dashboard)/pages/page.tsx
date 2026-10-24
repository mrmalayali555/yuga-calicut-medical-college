import { AdminHeader, AdminCard } from "@/components/admin/admin-ui";
import { Field, TextArea, SubmitBtn } from "@/components/admin/form-fields";
import { db } from "@/lib/db";
import { savePage } from "@/lib/actions/content";
import { COLLEGE, YUGA } from "@/lib/site";

async function getAboutData() {
  const p = await db.page.findUnique({ where: { key: "about" } });
  let data: Record<string, string> = {};
  try {
    data = p?.content ? JSON.parse(p.content) : {};
  } catch {}
  return {
    title: p?.title ?? `About YUGA & ${COLLEGE.name}`,
    data: {
      history:
        data.history ||
        `Government Medical College Kozhikode, established in 1957, stands as a historic bastion of healthcare education in Kerala. Spanning over 270 acres, it serves millions of patients across Malabar with dedicated hospital wings, tertiary casualty desks, and the renowned Institute of Maternal and Child Health (IMCH).`,
      mission:
        data.mission ||
        `To uphold the collective voice, academic excellence, and general welfare of the student medicos, nurturing clinical empathy, research vigor, and sportsmanship.`,
      vision:
        data.vision ||
        `A unified, transparent campus union embodying dignity, integrity, and proactive leadership for the 2026-2027 academic epoch.`,
      chairperson:
        data.chairperson ||
        `Welcome to YUGA 2026-2027. Our union stands dedicated to ensuring every student medico has the institutional support, artistic avenues, and emergency backing to flourish.`,
      generalSecretary:
        data.generalSecretary ||
        `From timely representation on academic postings to seamless inter-collegiate conclaves, YUGA remains committed to transparent governance.`,
    },
  };
}

export default async function AdminPagesPage() {
  const about = await getAboutData();

  return (
    <>
      <AdminHeader
        title="Custom Pages Editor"
        description="Edit public institutional pages, leadership messages, mission, vision, and campus heritage."
      />

      <div className="space-y-8">
        <AdminCard>
          <div className="mb-6 flex items-center justify-between border-b border-[var(--border-primary)] pb-4">
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                About Union & Campus Heritage Page
              </h3>
              <p className="text-xs text-[var(--text-secondary)] font-normal">
                Controls the narrative, constitution, and leadership addresses on <code className="text-emerald-700">/about</code>.
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
              Key: about
            </span>
          </div>

          <form action={savePage.bind(null, "about")} className="grid gap-5">
            <Field
              label="Page Headline"
              name="title"
              defaultValue={about.title}
              required
            />
            <TextArea
              label="Campus Heritage & History"
              name="history"
              defaultValue={about.data.history}
              rows={4}
              placeholder="Foundational story of Government Medical College Kozhikode"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextArea
                label="Union Mission Statement"
                name="mission"
                defaultValue={about.data.mission}
                rows={3}
              />
              <TextArea
                label="Union Vision 2026-2027"
                name="vision"
                defaultValue={about.data.vision}
                rows={3}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextArea
                label="Message from Union Chairperson"
                name="chairperson"
                defaultValue={about.data.chairperson}
                rows={3}
              />
              <TextArea
                label="Message from General Secretary"
                name="generalSecretary"
                defaultValue={about.data.generalSecretary}
                rows={3}
              />
            </div>
            <div className="pt-2">
              <SubmitBtn>Save Page Content</SubmitBtn>
            </div>
          </form>
        </AdminCard>
      </div>
    </>
  );
}
