import prisma from "@/lib/prisma";

async function seedDb() {
  await prisma.answer.create({
    data: {
      character: "target1",
      x: 0.298,
      y: 0.182,
    },
  });
  await prisma.answer.create({
    data: {
      character: "target2",
      x: 0.472,
      y: 0.463,
    },
  });
  await prisma.answer.create({
    data: {
      character: "target3",
      x: 0.592,
      y: 0.878,
    },
  });
}

seedDb();
