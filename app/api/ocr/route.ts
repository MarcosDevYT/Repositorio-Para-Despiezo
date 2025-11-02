import { NextResponse } from "next/server";
import client from "@/lib/googleVision";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json({ error: "No image" }, { status: 400 });
    }

    // Convertimos a buffer directamente
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Google Vision puede recibir buffer
    const [result] = await client.textDetection({ image: { content: buffer } });

    const text = result.textAnnotations?.[0]?.description || "";

    return NextResponse.json({ text });
  } catch (err) {
    console.error("OCR failed:", err);
    return NextResponse.json({ error: "OCR failed" }, { status: 500 });
  }
}
