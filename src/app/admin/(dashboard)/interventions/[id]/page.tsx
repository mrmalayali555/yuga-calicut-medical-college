import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-ui";
import { InterventionForm } from "@/components/admin/intervention-form";
import { db } from "@/lib/db";
import { updateIntervention, deleteIntervention } from "@/lib/actions/interventions";

export default async function EditInterventionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await db.intervention.findUnique({ where: { id } });
  if (!item) notFound();

  const update = updateIntervention.bind(null, id);
  const remove = deleteIntervention.bind(null, id);

  return (
    <>
      <AdminHeader title="Edit intervention" description={item.title} />
      <InterventionForm item={item} action={update} deleteAction={remove} />
    </>
  );
}
