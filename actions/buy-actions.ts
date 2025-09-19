"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { baseUrl } from "@/lib/utils";
import { Address } from "@prisma/client";
import { redirect } from "next/navigation";
import type Stripe from "stripe";

/**
 * Función para armar el checkout de stripe con los datos del producto a comprar
 * @param productId Id del producto a comprar
 * @returns Retornamos la url del checkout de stripe
 */
export async function buyProductActions(
  productId: string,
  userAddressId: string,
  userPhoneNumber: string
) {
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
    const vendedor = await prisma.user.findUnique({
      where: {
        id: product.vendorId,
      },
      select: {
        connectedAccountId: true,
      },
    });

    // Datos para stripe
    const priceProduct = product.offer
      ? Number(product.offerPrice)
      : Number(product.price);

    const applicationFee = Math.round(priceProduct * 0.1);

    const stripePrice = Math.round(priceProduct * 100);

    // Checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: session.user.email,
      metadata: {
        buyerId: session.user.id,
        vendedorId: product.vendorId,
        productId: product.id,
        vendedorConnectedAccountId: vendedor!.connectedAccountId,
        applicationFee: applicationFee,
        userAddressId: userAddressId,
        userPhoneNumber: session.user.phoneNumber,
        userName: session.user.name,
      },
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

/**
 * Maneja checkout.session.completed
 * Para poder crear una orden de producto
 * - Recibe sessionObj (Stripe.Checkout.Session)
 */
export async function handleCheckoutCompleted(
  sessionObj: Stripe.Checkout.Session
) {
  console.log("Iniciando handleCheckoutSessionCompleted");

  // datos desde metadata
  const userId = sessionObj.metadata?.buyerId;
  const vendedorId = sessionObj.metadata?.vendedorId;
  const productId = sessionObj.metadata?.productId;
  const vendedorConnectedAccountId =
    sessionObj.metadata?.vendedorConnectedAccountId;
  const applicationFee = sessionObj.metadata?.applicationFee;
  const productPrice = sessionObj.amount_total;
  const userAddressId = sessionObj.metadata?.userAddressId;
  const userPhoneNumber = sessionObj.metadata?.userPhoneNumber;
  const userName = sessionObj.metadata?.userName;

  if (
    !userId ||
    !vendedorId ||
    !productId ||
    !vendedorConnectedAccountId ||
    !applicationFee ||
    !productPrice ||
    !userAddressId ||
    !userPhoneNumber ||
    !userName
  ) {
    throw new Error("Error al crear la orden: faltan datos");
  }

  try {
    // calcular montos
    const amountTotal = Number(productPrice); // viene en centavos
    const feeAmount = Number(applicationFee) * 100; // acá lo pasamos a centavos
    const vendorAmount = amountTotal - feeAmount;

    // calcular fecha de release (20 días después del pago)
    const releaseAt = new Date();
    releaseAt.setDate(releaseAt.getDate() + 20);

    // Cambiar el estado del producto como vendido
    await prisma.product.update({
      where: { id: productId },
      data: { status: "vendido" },
    });

    // Obtener la direccion del usuario
    const userAddress = await prisma.address.findUnique({
      where: { id: userAddressId },
    });

    if (!userAddress) {
      throw new Error(
        "Error al crear la orden: no se encontro la dirección del usuario"
      );
    }

    // crear la orden en DB
    const orden = await prisma.orden.create({
      data: {
        productId: productId,
        buyerId: userId,
        vendorId: vendedorId,
        stripeSessionId: sessionObj.id,
        stripePaymentIntent: sessionObj.payment_intent as string,
        amountTotal,
        vendorAmount,
        feeAmount,
        status: "paid",
        releaseAt,

        // Datos del envio
        shippingCountry: userAddress.country,
        shippingCity: userAddress.city,
        shippingPostalCode: userAddress.postalCode,
        shippingAddressLine1: userAddress.street,
        shippingAddressLine2: userAddress.number,
        shippingName: userName,
        shippingPhone: userPhoneNumber,
      },
    });

    console.log("Orden creada correctamente:", orden.id);
    return orden;
  } catch (error) {
    console.error("Error creando orden en DB:", error);
    throw new Error("Error creando la orden en DB");
  }
}

/**
 * Libera el pago al vendedor cuando corresponde
 * @param productId Id del producto vendido
 * @param motivo "delivery" | "timeout" (para loguear si fue por entrega confirmada o por tiempo)
 */
export async function releasePaymentAction(
  productId: string,
  motivo: "delivery" | "timeout"
) {
  try {
    // 1. Buscar la orden (usamos findFirst porque productId no es único)
    const orden = await prisma.orden.findFirst({
      where: { productId, status: "paid" },
      include: {
        vendor: {
          select: { connectedAccountId: true },
        },
      },
    });

    if (!orden) {
      console.error(
        "No se encontró una orden 'paid' para productId:",
        productId
      );
      return null;
    }

    if (!orden.vendor.connectedAccountId) {
      console.error("El vendedor no tiene connectedAccountId:", orden.vendorId);
      return null;
    }

    // 2. Hacer transferencia al vendedor en Stripe
    const transferencia = await stripe.transfers.create({
      amount: orden.vendorAmount, // en centavos
      currency: "eur",
      destination: orden.vendor.connectedAccountId,
      metadata: {
        orderId: orden.id,
        productId: orden.productId,
        motivo,
      },
    });

    // 3. Actualizar la orden como liberada
    const ordenLiberada = await prisma.orden.update({
      where: { id: orden.id },
      data: {
        payoutReleased: true,
        releasedAt: new Date(), // Campo para guardar la fecha de transferencia
        stripeTransferId: transferencia.id, // Campo para guardar la transferencia
      },
    });

    console.log(
      `Pago liberado para la orden ${orden.id}, transferencia ${transferencia.id}`
    );

    return ordenLiberada;
  } catch (error) {
    console.error("Error liberando el pago:", error);
    throw new Error("No se pudo liberar el pago al vendedor");
  }
}
