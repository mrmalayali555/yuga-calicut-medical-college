import { AdminHeader } from "@/components/admin/admin-ui";
import { InterventionForm } from "@/components/admin/intervention-form";
import { createIntervention } from "@/lib/actions/interventions";

export default function NewInterventionPage() {
  return (
    <>
      <AdminHeader
        title="Add Union Intervention"
        description="Record an official representation, meeting resolution, or memorandum."
      />
      <InterventionForm action={createIntervention} />
    </>
  );
}
