"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { baseUrl } from "@/lib/utils";
import { redirect } from "next/navigation";

export async function buyProductActions(productId: string) {
  try {
    const session = await auth();

    // Si el usuario no esta logeado redirigir
    if (!session?.user) redirect("/login");

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    // Si no hay producto devolvemos el error
    if (!product) return { error: "Producto no encontrado" };

    // Si el comprador es el mismo vendedor dar aviso
    if (product.vendorId === session.user.id)
      return { error: "No puedes comprar tu propio producto" };

    // Si el producto no esta disponible devolvemos el error
    if (product.status === "vendido" || product.status === "cancelado")
      return { error: "Producto no disponible" };

    // Una vez pasa todas las pruebas, preparamos los datos
    const priceProduct = product.offer
      ? Number(product.offerPrice)
      : Number(product.price);
    const stripePrice = Math.round(priceProduct * 100);

    const stripeSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: session.user.email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: stripePrice,
            product_data: {
              name: product.name,
              description: product.description,
              images: [product.images[0]],
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/payment/success`,
      cancel_url: `${baseUrl}/payment/cancel`,
    });

    return { url: stripeSession.url as string };
  } catch (error) {
    console.log("Error iniciando checkout: ", error);
    throw new Error("Error al comprar el producto");
  }
}
