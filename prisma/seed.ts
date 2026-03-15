import prisma from "@/lib/prisma";

async function seedDb() {
  await prisma.answer.deleteMany();
  await prisma.round.deleteMany();
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
      x: 0.476,
      y: 0.461,
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
