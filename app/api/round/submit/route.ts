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
  correctCount: number,
  startTime: Date,
): Promise<{ isCoorect: boolean; isGameOver: boolean }> {
  try {
    const res = await prisma.answer.findFirstOrThrow({
      where: {
        character: answer.character,
      },
    });
    const half = SEARCH_RADIUS / 2;
    const isCoorect =
      answer.x >= res.x - half &&
      answer.x <= res.x + half &&
      answer.y >= res.y - half &&
      answer.y <= res.y + half;
    if (isCoorect) {
      correctCount++;
      let end = new Date();
      let durationMs = end.getTime() - startTime.getTime();
      if (correctCount === 36) {
        await prisma.round.update({
          where: {
            id: answer.roundId,
          },
          data: { correctCount, endTime: end, durationMs: durationMs },
        });
        return { isCoorect: true, isGameOver: true };
      } else {
        await prisma.round.update({
          where: {
            id: answer.roundId,
          },
          data: { correctCount },
        });
        return { isCoorect: true, isGameOver: false };
      }
    }
    return { isCoorect: false, isGameOver: false };
  } catch (e) {
    throw e;
  }
}

export async function POST(request: Request) {
  const body = await request.json();

  const answer = answerSchema.safeParse(body);
  if (!answer.success)
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "invalid body",
      }),
      {
        status: 400,
      },
    );
  try {
    const round = await prisma.round.findFirstOrThrow({
      where: {
        id: answer.data.roundId,
      },
    });
    const res = await validateAnswer(
      answer.data,
      round.correctCount,
      round.startTime,
    );
    return new NextResponse(
      JSON.stringify({
        success: true,
        isGameOver: res.isGameOver,
        isCorrect: res.isCoorect,
      }),
    );
  } catch (e) {
    console.log(e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2018") {
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: "no record found with this roundId",
          }),
          {
            status: 400,
          },
        );
      }
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "internal server error",
        }),
        {
          status: 400,
        },
      );
    }
  }

  return new NextResponse(
    JSON.stringify({
      success: true,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}
