import { PrismaClient, Priority, Status } from "@prisma/client";

const prisma = new PrismaClient();

const users = [
  ["Aarav Mehta", "aarav@example.com", "AM"],
  ["Mira Kapoor", "mira@example.com", "MK"],
  ["Kabir Singh", "kabir@example.com", "KS"],
  ["Nisha Rao", "nisha@example.com", "NR"],
  ["Dev Patel", "dev@example.com", "DP"],
  ["Sara Khan", "sara@example.com", "SK"],
  ["Ishan Verma", "ishan@example.com", "IV"],
  ["Tara Bose", "tara@example.com", "TB"]
];

async function main() {
  await prisma.projectMember.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const createdUsers = await Promise.all(
    users.map(([name, email, avatarInitials]) =>
      prisma.user.create({ data: { name, email, avatarInitials } })
    )
  );

  const project = await prisma.project.create({
    data: {
      name: "Website Relaunch",
      description: "Plan and deliver the marketing website refresh."
    }
  });

  await prisma.projectMember.createMany({
    data: createdUsers.map((user) => ({ projectId: project.id, userId: user.id }))
  });

  const [aarav, mira, kabir, nisha, dev, sara] = createdUsers;
  const addDays = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  };

  await prisma.task.createMany({
    data: [
      {
        title: "Audit current landing pages",
        description: "Review existing messaging, traffic paths, and outdated sections.",
        priority: Priority.HIGH,
        status: Status.IN_PROGRESS,
        dueDate: addDays(2),
        projectId: project.id,
        assignedUserId: mira.id
      },
      {
        title: "Create homepage wireframe",
        description: "Draft responsive layout for hero, proof, features, and CTA sections.",
        priority: Priority.HIGH,
        status: Status.IN_PROGRESS,
        dueDate: addDays(3),
        projectId: project.id,
        assignedUserId: mira.id
      },
      {
        title: "Write launch copy",
        description: "Prepare concise copy for the homepage and pricing page.",
        priority: Priority.MEDIUM,
        status: Status.IN_PROGRESS,
        dueDate: addDays(4),
        projectId: project.id,
        assignedUserId: mira.id
      },
      {
        title: "Implement navigation",
        description: "Build desktop and mobile navigation with accessible focus states.",
        priority: Priority.MEDIUM,
        status: Status.IN_PROGRESS,
        dueDate: addDays(5),
        projectId: project.id,
        assignedUserId: mira.id
      },
      {
        title: "Optimize image assets",
        description: "Compress campaign images and prepare responsive variants.",
        priority: Priority.LOW,
        status: Status.IN_PROGRESS,
        dueDate: addDays(6),
        projectId: project.id,
        assignedUserId: mira.id
      },
      {
        title: "QA contact form",
        description: "Verify validation, success messaging, and error paths.",
        priority: Priority.HIGH,
        status: Status.IN_PROGRESS,
        dueDate: addDays(7),
        projectId: project.id,
        assignedUserId: mira.id
      },
      {
        title: "Define analytics events",
        description: "List key events for signup, demo request, and pricing interactions.",
        priority: Priority.MEDIUM,
        status: Status.TODO,
        dueDate: addDays(8),
        projectId: project.id,
        assignedUserId: aarav.id
      },
      {
        title: "Build testimonial section",
        description: "Create reusable testimonial cards with company and quote details.",
        priority: Priority.LOW,
        status: Status.TODO,
        dueDate: addDays(9),
        projectId: project.id,
        assignedUserId: kabir.id
      },
      {
        title: "Review accessibility",
        description: "Check headings, contrast, labels, and keyboard navigation.",
        priority: Priority.HIGH,
        status: Status.TODO,
        dueDate: addDays(10),
        projectId: project.id,
        assignedUserId: nisha.id
      },
      {
        title: "Prepare deployment checklist",
        description: "Confirm environment variables, rollback steps, and owner approvals.",
        priority: Priority.MEDIUM,
        status: Status.DONE,
        dueDate: addDays(-1),
        projectId: project.id,
        assignedUserId: dev.id
      },
      {
        title: "Finalize brand colors",
        description: "Document approved palette and usage examples for the new site.",
        priority: Priority.LOW,
        status: Status.DONE,
        dueDate: addDays(-2),
        projectId: project.id,
        assignedUserId: sara.id
      }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
