import { Prisma } from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

import * as z from "zod";

const answerSchema = z.object({
  roundId: z.string(),
  place: z.string(),
  x: z.int(),
  y: z.int(),
});

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
        id: answer.data?.roundId,
      },
    });
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "correct answer",
        round: round.id,
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
