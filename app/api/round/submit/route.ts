import { Prisma } from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import * as z from "zod";

const SEARCH_RADIUS = 0.05;

const answerSchema = z.object({
  roundId: z.string(),
  character: z.string(),
  x: z.number(),
  y: z.number(),
});

async function validateAnswer(
  answer: {
    roundId: string;
    character: string;
    x: number;
    y: number;
  },
  startTime: Date,
): Promise<{
  isCorrect: boolean;
  isGameOver: boolean;
  duration?: number;
  rank?: number;
}> {
  // 1. Get correct position
  const res = await prisma.answer.findUniqueOrThrow({
    where: {
      character: answer.character, // must be unique in schema
    },
  });

  const half = SEARCH_RADIUS / 2;

  const isCorrect =
    answer.x >= res.x - half &&
    answer.x <= res.x + half &&
    answer.y >= res.y - half &&
    answer.y <= res.y + half;

  // 2. If incorrect → exit early (no DB write)
  if (!isCorrect) {
    return { isCorrect: false, isGameOver: false };
  }

  try {
    await prisma.userAnswer.create({
      data: {
        roundId: answer.roundId,
        character: answer.character,
        x: answer.x,
        y: answer.y,
      },
    });
  } catch (e) {
    // duplicate (already found)
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      return { isCorrect: false, isGameOver: false };
    }
    throw e;
  }

  // 4. Count correct answers (source of truth)
  const count = await prisma.userAnswer.count({
    where: {
      roundId: answer.roundId,
    },
  });

  // 5. Check game completion
  if (count === 3) {
    const end = new Date();
    const durationMs = BigInt(end.getTime() - startTime.getTime());

    await prisma.round.update({
      where: { id: answer.roundId },
      data: {
        endTime: end,
        durationMs,
      },
    });

    const betterCount = await prisma.round.count({
      where: {
        durationMs: {
          lt: durationMs,
        },
        endTime: {
          not: null,
        },
      },
    });

    const rank = betterCount + 1;
    console.log("COUNT: ", count);

    return {
      isCorrect: true,
      isGameOver: true,
      duration: Number(durationMs) / 1000,
      rank,
    };
  }

  return { isCorrect: true, isGameOver: false };
}

export async function POST(request: Request) {
  const body = await request.json();

  const parsed = answerSchema.safeParse(body);

  if (!parsed.success) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "invalid body",
      }),
      { status: 400 },
    );
  }

  try {
    const round = await prisma.round.findUniqueOrThrow({
      where: {
        id: parsed.data.roundId,
      },
    });

    const res = await validateAnswer(parsed.data, round.startTime);

    return new NextResponse(
      JSON.stringify({
        success: true,
        isGameOver: res.isGameOver,
        isCorrect: res.isCorrect,
        ...(res.duration && { duration: res.duration }),
        ...(res.rank && { rank: res.rank }),
      }),
    );
  } catch (e) {
    console.error(e);

    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2018") {
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: "round not found",
          }),
          { status: 400 },
        );
      }
    }

    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "internal server error",
      }),
      { status: 500 },
    );
  }
}
