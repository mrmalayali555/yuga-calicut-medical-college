import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-ui";
import { NotificationForm } from "@/components/admin/notification-form";
import { db } from "@/lib/db";
import { updateNotification, deleteNotification } from "@/lib/actions/notifications";

export default async function EditNotificationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await db.notification.findUnique({ where: { id } });
  if (!item) notFound();

  const update = updateNotification.bind(null, id);
  const remove = deleteNotification.bind(null, id);

  return (
    <>
      <AdminHeader title="Edit notification" description={item.title} />
      <NotificationForm item={item} action={update} deleteAction={remove} />
    </>
  );
}
