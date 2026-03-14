import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(_request: Request) {
  const roundId = (await prisma.round.create({})).id;
  return new NextResponse(
    JSON.stringify({
      success: true,
      roundId,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}
