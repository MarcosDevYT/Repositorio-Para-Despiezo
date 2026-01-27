import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    const normalized = query.toLowerCase().trim();

    // Buscar si ya existe log solo por texto
    const existing = await prisma.searchLog.findFirst({
      where: { query: normalized },
    });

    if (existing) {
      await prisma.searchLog.update({
        where: { id: existing.id },
        data: { clicks: { increment: 1 } },
      });
    } else {
      await prisma.searchLog.create({
        data: {
          query: normalized,
          clicks: 1,
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Error logging search:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
