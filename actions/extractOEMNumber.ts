"use server";

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default async function extractOEMNumber(imageUrl: string) {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Sos un extractor de texto OEM. Devuelve únicamente el número OEM encontrado en la imagen, en formato JSON válido con la clave 'oem_number'.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Extrae el número OEM troquelado en la pieza de esta imagen. Responde SOLO en JSON.",
          },
          { type: "image_url", image_url: { url: imageUrl } },
        ],
      },
    ],
    temperature: 0,
  });

  let output = response.choices[0].message.content || "";

  // Limpiar backticks o ```json``` que a veces devuelve ChatGPT
  output = output
    .trim()
    .replace(/^```json\s*/, "")
    .replace(/```$/, "");

  try {
    const parsed = JSON.parse(output);
    return parsed.oem_number || null;
  } catch (e) {
    console.error("Error al parsear JSON de OpenAI:", output);
    return null;
  }
}
