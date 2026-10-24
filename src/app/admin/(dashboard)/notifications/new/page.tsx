import { AdminHeader } from "@/components/admin/admin-ui";
import { NotificationForm } from "@/components/admin/notification-form";
import { createNotification } from "@/lib/actions/notifications";

export default function NewNotificationPage() {
  return (
    <>
      <AdminHeader
        title="New notification"
        description="Publish a circular, notice or announcement to the student community."
      />
      <NotificationForm action={createNotification} />
    </>
  );
}
