import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();
const backup = JSON.parse(fs.readFileSync("cloud-db-backup.json", "utf8"));

function toDate(v) {
  if (!v) return null;
  return new Date(v);
}

async function restore() {
  console.log("Restoring all data from cloud backup into local SQLite database...");

  // 1. Settings
  if (backup.Setting?.length) {
    console.log(`Restoring ${backup.Setting.length} Settings...`);
    for (const s of backup.Setting) {
      await prisma.setting.upsert({
        where: { key: s.key },
        update: { value: s.value },
        create: { key: s.key, value: s.value },
      });
    }
  }

  // 2. Admins
  if (backup.Admin?.length) {
    console.log(`Restoring ${backup.Admin.length} Admins...`);
    for (const a of backup.Admin) {
      await prisma.admin.upsert({
        where: { email: a.email },
        update: {
          name: a.name,
          passwordHash: a.passwordHash,
          role: a.role,
          avatar: a.avatar,
        },
        create: {
          id: a.id,
          name: a.name,
          email: a.email,
          passwordHash: a.passwordHash,
          role: a.role,
          avatar: a.avatar,
        },
      });
    }
  }

  // 3. Committees & Members
  if (backup.Committee?.length) {
    console.log(`Restoring ${backup.Committee.length} Committees...`);
    await prisma.committeeMember?.deleteMany?.({}).catch(() => {});
    await prisma.committee?.deleteMany?.({}).catch(() => {});
    for (const c of backup.Committee) {
      await prisma.committee.create({
        data: {
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description,
          category: c.category,
          logo: c.logo,
          portalUrl: c.portalUrl,
          accent: c.accent,
          socialLinks: c.socialLinks,
          order: c.order ?? 0,
          createdAt: toDate(c.createdAt) || new Date(),
        },
      });
    }
  }

  if (backup.CommitteeMember?.length) {
    console.log(`Restoring ${backup.CommitteeMember.length} Committee Members...`);
    for (const m of backup.CommitteeMember) {
      await prisma.committeeMember.create({
        data: {
          id: m.id,
          committeeId: m.committeeId,
          name: m.name,
          position: m.position,
          photo: m.photo,
          contact: m.contact,
          order: m.order ?? 0,
        },
      });
    }
  }

  // 4. Events
  if (backup.Event?.length) {
    console.log(`Restoring ${backup.Event.length} Events...`);
    await prisma.eventAttachment?.deleteMany?.({}).catch(() => {});
    await prisma.eventMedia?.deleteMany?.({}).catch(() => {});
    await prisma.galleryPhoto?.deleteMany?.({}).catch(() => {});
    await prisma.eventGallery?.deleteMany?.({}).catch(() => {});
    await prisma.registrationSubmission?.deleteMany?.({}).catch(() => {});
    await prisma.registrationField?.deleteMany?.({}).catch(() => {});
    await prisma.registrationForm?.deleteMany?.({}).catch(() => {});
    await prisma.event.deleteMany({});
    for (const e of backup.Event) {
      await prisma.event.create({
        data: {
          id: e.id,
          title: e.title,
          slug: e.slug || e.id,
          description: e.description,
          date: toDate(e.date) || new Date(),
          endDate: toDate(e.endDate),
          time: e.time,
          venue: e.venue,
          poster: e.poster,
          status: e.status || "upcoming",
          published: e.published ?? true,
          committeeId: e.committeeId || null,
          createdAt: toDate(e.createdAt) || new Date(),
          updatedAt: toDate(e.updatedAt) || new Date(),
        },
      });
    }
  }

  // 5. EventGallery & GalleryPhoto
  if (backup.EventGallery?.length) {
    console.log(`Restoring ${backup.EventGallery.length} Event Galleries...`);
    for (const eg of backup.EventGallery) {
      await prisma.eventGallery.create({
        data: {
          id: eg.id,
          eventId: eg.eventId,
          theme: eg.theme,
          titleLine1: eg.titleLine1 || "",
          titleLine2: eg.titleLine2 || "",
          subtitle: eg.subtitle || "",
          blogText: eg.blogText,
          createdAt: toDate(eg.createdAt) || new Date(),
          updatedAt: toDate(eg.updatedAt) || new Date(),
        },
      });
    }
  }

  if (backup.GalleryPhoto?.length) {
    console.log(`Restoring ${backup.GalleryPhoto.length} Gallery Photos...`);
    for (const g of backup.GalleryPhoto) {
      await prisma.galleryPhoto.create({
        data: {
          id: g.id,
          galleryId: g.galleryId,
          url: g.url,
          caption: g.caption,
          position: g.position ?? 0,
          order: g.order ?? 0,
          zoom: g.zoom ?? 1,
          offsetX: g.offsetX ?? 0,
          offsetY: g.offsetY ?? 0,
          rotation: g.rotation ?? 0,
        },
      });
    }
  }

  // 6. RegistrationForm, Fields & Submissions
  if (backup.RegistrationForm?.length) {
    console.log(`Restoring ${backup.RegistrationForm.length} Registration Forms...`);
    for (const rf of backup.RegistrationForm) {
      await prisma.registrationForm.create({
        data: {
          id: rf.id,
          title: rf.title,
          slug: rf.slug,
          description: rf.description,
          eventId: rf.eventId,
          deadline: toDate(rf.deadline),
          published: rf.published ?? true,
          createdAt: toDate(rf.createdAt) || new Date(),
          updatedAt: toDate(rf.updatedAt) || new Date(),
        },
      });
    }
  }

  if (backup.RegistrationField?.length) {
    console.log(`Restoring ${backup.RegistrationField.length} Registration Fields...`);
    for (const field of backup.RegistrationField) {
      await prisma.registrationField.create({
        data: {
          id: field.id,
          formId: field.formId,
          label: field.label,
          type: field.type,
          required: field.required ?? false,
          placeholder: field.placeholder,
          options: field.options,
          order: field.order ?? 0,
        },
      });
    }
  }

  if (backup.RegistrationSubmission?.length) {
    console.log(`Restoring ${backup.RegistrationSubmission.length} Registration Submissions...`);
    for (const sub of backup.RegistrationSubmission) {
      await prisma.registrationSubmission.create({
        data: {
          id: sub.id,
          formId: sub.formId,
          data: sub.data,
          files: sub.files,
          createdAt: toDate(sub.createdAt) || new Date(),
        },
      });
    }
  }

  // 7. Interventions
  if (backup.Intervention?.length) {
    console.log(`Restoring ${backup.Intervention.length} Interventions...`);
    await prisma.intervention.deleteMany({});
    for (const item of backup.Intervention) {
      await prisma.intervention.create({
        data: {
          id: item.id,
          title: item.title,
          slug: item.slug || item.id,
          description: item.description,
          date: toDate(item.date) || new Date(),
          image: item.image,
          pdfUrl: item.pdfUrl,
          category: item.category,
          pinned: item.pinned ?? false,
          published: item.published ?? true,
          createdAt: toDate(item.createdAt) || new Date(),
          updatedAt: toDate(item.updatedAt) || new Date(),
        },
      });
    }
  }

  // 8. Achievements
  if (backup.Achievement?.length) {
    console.log(`Restoring ${backup.Achievement.length} Achievements...`);
    await prisma.achievementMedia?.deleteMany?.({}).catch(() => {});
    await prisma.achievement.deleteMany({});
    for (const a of backup.Achievement) {
      await prisma.achievement.create({
        data: {
          id: a.id,
          title: a.title,
          slug: a.slug || a.id,
          category: a.category,
          description: a.description,
          date: toDate(a.date) || new Date(),
          coverImage: a.coverImage,
          awardWinner: a.awardWinner,
          published: a.published ?? true,
          createdAt: toDate(a.createdAt) || new Date(),
          updatedAt: toDate(a.updatedAt) || new Date(),
        },
      });
    }
  }

  // 9. Notifications
  if (backup.Notification?.length) {
    console.log(`Restoring ${backup.Notification.length} Notifications...`);
    await prisma.notification.deleteMany({});
    for (const n of backup.Notification) {
      await prisma.notification.create({
        data: {
          id: n.id,
          title: n.title,
          slug: n.slug || n.id,
          description: n.description,
          date: toDate(n.date) || new Date(),
          image: n.image,
          pdfUrl: n.pdfUrl,
          published: n.published ?? true,
          createdAt: toDate(n.createdAt) || new Date(),
          updatedAt: toDate(n.updatedAt) || new Date(),
        },
      });
    }
  }

  // 10. Emergency Contacts
  if (backup.EmergencyContact?.length) {
    console.log(`Restoring ${backup.EmergencyContact.length} Emergency Contacts...`);
    await prisma.emergencyContact.deleteMany({});
    for (const c of backup.EmergencyContact) {
      await prisma.emergencyContact.create({
        data: {
          id: c.id,
          name: c.name,
          phone: c.phone,
          category: c.category,
          description: c.description,
          active: c.active ?? true,
          order: c.order ?? 0,
          showOnHomepage: c.showOnHomepage ?? false,
        },
      });
    }
  }

  // 11. Media
  if (backup.Media?.length) {
    console.log(`Restoring ${backup.Media.length} Media items...`);
    await prisma.media.deleteMany({});
    for (const m of backup.Media) {
      await prisma.media.create({
        data: {
          id: m.id,
          name: m.name,
          url: m.url,
          type: m.type,
          size: m.size,
          mime: m.mime || m.mimeType || null,
          width: m.width || null,
          height: m.height || null,
          createdAt: toDate(m.createdAt) || new Date(),
        },
      });
    }
  }

  // 12. ContentBlocks
  if (backup.ContentBlock?.length) {
    console.log(`Restoring ${backup.ContentBlock.length} Content Blocks...`);
    await prisma.contentEdit?.deleteMany?.({}).catch(() => {});
    await prisma.contentBlock.deleteMany({});
    for (const b of backup.ContentBlock) {
      await prisma.contentBlock.create({
        data: {
          id: b.id,
          pageId: b.pageId,
          blockId: b.blockId,
          content: b.content || "",
          type: b.type || "text",
          updatedAt: toDate(b.updatedAt) || new Date(),
        },
      });
    }
  }

  // 13. Finance
  if (backup.FinanceEntry?.length) {
    console.log(`Restoring ${backup.FinanceEntry.length} Finance entries...`);
    await prisma.financeEntry.deleteMany({});
    for (const f of backup.FinanceEntry) {
      await prisma.financeEntry.create({
        data: {
          id: f.id,
          kind: f.kind,
          category: f.category,
          label: f.label,
          amount: parseFloat(f.amount),
          note: f.note || null,
          receiptUrl: f.receiptUrl || null,
          date: toDate(f.date) || new Date(),
          createdAt: toDate(f.createdAt) || new Date(),
        },
      });
    }
  }

  // 14. Marquee
  if (backup.Marquee?.length) {
    console.log(`Restoring ${backup.Marquee.length} Marquee entries...`);
    await prisma.marquee.deleteMany({});
    for (const m of backup.Marquee) {
      await prisma.marquee.create({
        data: {
          id: m.id,
          enabled: m.enabled ?? true,
          text: m.text,
          buttonText: m.buttonText,
          buttonUrl: m.buttonUrl,
          updatedAt: toDate(m.updatedAt) || new Date(),
        },
      });
    }
  }

  console.log("🎉 SUCCESS! ALL cloud database content successfully restored into local database!");
}

restore()
  .catch((e) => {
    console.error("Restore error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
