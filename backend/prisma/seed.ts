import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function main() {
  await db.notification.deleteMany();
  await db.submission.deleteMany();
  await db.comment.deleteMany();
  await db.task.deleteMany();
  await db.user.deleteMany();

  const users = await Promise.all([
    db.user.create({ data: { id: "u1", name: "Alex Morgan", email: "alex@acme.co", role: "manager", department: "Operations", active: true } }),
    db.user.create({ data: { id: "u2", name: "Priya Shah", email: "priya@acme.co", role: "staff", department: "Design", active: true } }),
    db.user.create({ data: { id: "u3", name: "Jordan Lee", email: "jordan@acme.co", role: "staff", department: "Engineering", active: true } }),
    db.user.create({ data: { id: "u4", name: "Sam Patel", email: "sam@acme.co", role: "staff", department: "Marketing", active: false } }),
    db.user.create({ data: { id: "u5", name: "Riley Chen", email: "riley@acme.co", role: "manager", department: "Engineering", active: true } }),
    db.user.create({ data: { id: "u6", name: "Taylor Brooks", email: "taylor@acme.co", role: "super_admin", department: "Executive", active: true } }),
    db.user.create({ data: { id: "u7", name: "Noah Kim", email: "noah@acme.co", role: "staff", department: "Sales", active: true } }),
    db.user.create({ data: { id: "u8", name: "Maya Singh", email: "maya@acme.co", role: "staff", department: "Support", active: true } }),
  ]);

  const tasks = await Promise.all([
    db.task.create({
      data: {
        id: "TSK-1042",
        title: "Q4 product launch landing page",
        description: "Design and ship the new landing page for the Q4 launch, including hero, features, and pricing.",
        priority: "high",
        status: "in_progress",
        assignedToId: "u2",
        assignedById: "u1",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        attachments: JSON.stringify([{ name: "brief.pdf", size: "2.1 MB" }, { name: "wires.fig", size: "880 KB" }]),
      },
    }),
    db.task.create({
      data: {
        id: "TSK-1043",
        title: "Migrate auth to new identity provider",
        description: "Cut over from legacy auth to the new IdP with zero downtime.",
        priority: "urgent",
        status: "under_review",
        assignedToId: "u3",
        assignedById: "u5",
        createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        attachments: JSON.stringify([{ name: "migration-plan.pdf", size: "1.4 MB" }]),
      },
    }),
    db.task.create({
      data: {
        id: "TSK-1044",
        title: "Weekly social content calendar",
        description: "Plan and schedule social posts across LinkedIn, X, and Instagram for the next week.",
        priority: "medium",
        status: "approved",
        assignedToId: "u4",
        assignedById: "u1",
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    }),
    db.task.create({
      data: {
        id: "TSK-1045",
        title: "Customer onboarding email sequence",
        description: "Write a 5-email onboarding sequence with metrics tracking.",
        priority: "low",
        status: "assigned",
        assignedToId: "u7",
        assignedById: "u1",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    }),
    db.task.create({
      data: {
        id: "TSK-1046",
        title: "Refactor dashboard charts for performance",
        description: "Reduce TTI on the analytics dashboard from 4.2s to under 2s.",
        priority: "high",
        status: "submitted",
        assignedToId: "u3",
        assignedById: "u5",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        attachments: JSON.stringify([{ name: "perf-audit.pdf", size: "3.2 MB" }]),
      },
    }),
    db.task.create({
      data: {
        id: "TSK-1047",
        title: "Quarterly compliance audit",
        description: "Run through SOC2 controls and document remediation items.",
        priority: "urgent",
        status: "rejected",
        assignedToId: "u8",
        assignedById: "u6",
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        attachments: JSON.stringify([{ name: "soc2-checklist.pdf", size: "1.1 MB" }]),
      },
    }),
    db.task.create({
      data: {
        id: "TSK-1048",
        title: "Sales deck v3 polish",
        description: "Update the enterprise sales deck with new logos and case studies.",
        priority: "medium",
        status: "completed",
        assignedToId: "u7",
        assignedById: "u1",
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
    }),
    db.task.create({
      data: {
        id: "TSK-1049",
        title: "Support macros review",
        description: "Audit and consolidate Zendesk macros for the support team.",
        priority: "low",
        status: "in_progress",
        assignedToId: "u8",
        assignedById: "u1",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
    }),
  ]);

  await Promise.all([
    db.comment.create({ data: { taskId: "TSK-1042", userId: "u1", text: "Please align the hero copy with the new tagline.", at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) } }),
    db.comment.create({ data: { taskId: "TSK-1042", userId: "u2", text: "On it — sharing v1 by EOD.", at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) } }),
    db.comment.create({ data: { taskId: "TSK-1047", userId: "u6", text: "Missing evidence for AC-3, please resubmit.", at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) } }),
  ]);

  await Promise.all([
    db.submission.create({ data: { id: "s1", taskId: "TSK-1043", userId: "u3", at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), notes: "Staging cutover complete, awaiting review.", files: JSON.stringify(["report.pdf"]), links: JSON.stringify(["https://staging.acme.co"]), status: "under_review" } }),
    db.submission.create({ data: { id: "s2", taskId: "TSK-1044", userId: "u4", at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), notes: "Calendar finalized.", files: JSON.stringify(["calendar.xlsx"]), links: JSON.stringify([]), status: "approved" } }),
    db.submission.create({ data: { id: "s3", taskId: "TSK-1046", userId: "u3", at: new Date(), notes: "Achieved 1.7s TTI. PR linked.", files: JSON.stringify([]), links: JSON.stringify(["https://github.com/acme/app/pull/482"]), status: "submitted" } }),
    db.submission.create({ data: { id: "s4", taskId: "TSK-1047", userId: "u8", at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), notes: "First pass complete.", files: JSON.stringify(["audit.pdf"]), links: JSON.stringify([]), status: "rejected" } }),
    db.submission.create({ data: { id: "s5", taskId: "TSK-1048", userId: "u7", at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000), notes: "Final deck delivered.", files: JSON.stringify(["deck.pdf"]), links: JSON.stringify([]), status: "completed" } }),
  ]);

  await Promise.all([
    db.notification.create({ data: { id: "n1", title: "New task assigned", message: "Alex assigned you 'Q4 product launch landing page'", category: "assignment", read: false, at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), userId: "u2" } }),
    db.notification.create({ data: { id: "n2", title: "Approaching deadline", message: "'Migrate auth' is due tomorrow", category: "reminder", read: false, at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), userId: "u3" } }),
    db.notification.create({ data: { id: "n3", title: "Submission approved", message: "Your submission for 'Social calendar' was approved", category: "approval", read: true, at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), userId: "u4" } }),
    db.notification.create({ data: { id: "n4", title: "Changes requested", message: "Compliance audit submission was rejected — see comments", category: "rejection", read: false, at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), userId: "u8" } }),
    db.notification.create({ data: { id: "n5", title: "Reminder", message: "Weekly status report due Friday", category: "reminder", read: true, at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), userId: "u2" } }),
  ]);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
