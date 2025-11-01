"use server";

import { auth } from "@/auth";
import { stripePlans } from "@/lib/constants/data";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { baseUrl } from "@/lib/utils";
import { revalidatePath } from "next/cache";
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
        userPhoneNumber: userPhoneNumber,
        userName: session.user.name,
        typeOfBuy: "COMPRAR",
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
 * Función para armar el checkout de Stripe con los datos del kit para comprar
 * @param productIds Array de IDs de productos del kit
 * @param kitId ID del kit
 * @param userAddressId ID de la dirección del usuario
 * @param userPhoneNumber Teléfono del usuario
 */
export async function buyKitProductsActions(
  productIds: string[],
  kitId: string,
  userAddressId: string,
  userPhoneNumber: string
) {
  try {
    const session = await auth();
    if (!session?.user) redirect("/login");

    // Buscar el kit con sus productos
    const kit = await prisma.kit.findUnique({
      where: { id: kitId },
      include: {
        products: {
          include: { product: true },
        },
      },
    });

    if (!kit) return { error: "Kit no encontrado" };

    // Verificar que los productos existan y estén publicados
    const validProducts = kit.products
      .map((kp) => kp.product)
      .filter((p) => p.status === "publicado");

    if (validProducts.length === 0)
      return { error: "No hay productos válidos en este kit" };

    // Validar que el usuario no compre su propio kit
    const isOwnProduct = validProducts.some(
      (p) => p.vendorId === session.user.id
    );
    if (isOwnProduct) return { error: "No puedes comprar tu propio kit" };

    // Obtener vendedor
    const vendedor = await prisma.user.findUnique({
      where: { id: validProducts[0].vendorId },
      select: { connectedAccountId: true },
    });

    // 💰 Usamos el precio total del kit (ya con descuento aplicado)
    const totalPrice = kit.price;
    const applicationFee = Math.round(totalPrice * 0.1);

    // 🧾 Creamos solo un item de Stripe representando el KIT
    const stripeLineItems = [
      {
        price_data: {
          currency: "eur",
          unit_amount: Math.round(totalPrice * 100),
          product_data: {
            name: kit.name,
            description:
              kit.description ||
              `Incluye ${validProducts.length} productos con ${kit.discount}% de descuento.`,
            images: kit.images.length ? [kit.images[0]] : [],
          },
        },
        quantity: 1,
      },
    ];

    // Crear sesión de Stripe
    const stripeSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: session.user.email,
      metadata: {
        buyerId: session.user.id,
        vendedorId: validProducts[0].vendorId,
        productIds: JSON.stringify(productIds),
        kitId,
        vendedorConnectedAccountId: vendedor?.connectedAccountId || "",
        applicationFee,
        userAddressId,
        userPhoneNumber,
        userName: session.user.name,
        typeOfBuy: "COMPRAR-KIT",
      },
      line_items: stripeLineItems,
      success_url: `${baseUrl}/payment/success`,
      cancel_url: `${baseUrl}/payment/cancel`,
    });

    return { url: stripeSession.url as string };
  } catch (error) {
    console.error("Error iniciando checkout del kit:", error);
    return { error: "Error al comprar el kit" };
  }
}

/**
 * Función para armar el checkout de stripe con los datos del producto a comprar
 * @param productId Id del producto a comprar
 * @returns Retornamos la url del checkout de stripe
 */
export async function destacarProductAction(
  productId: string,
  price: number,
  days: string
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
    if (product.vendorId !== session.user.id)
      return { error: "No puedes destacar el producto de otra persona." };

    // Si el producto no esta disponible devolvemos el error
    if (product.status === "vendido" || product.status === "cancelado")
      return { error: "Producto no disponible" };

    const stripePrice = Math.round(price * 100);

    // Checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: session.user.email,
      metadata: {
        productId: product.id,
        vendedorId: product.id,
        userName: session.user.name,
        typeOfBuy: "DESTACAR",
        days: days,
      },
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: stripePrice,
            product_data: {
              name: `Destacar por ${days} dias ${product.name}`,
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
 *  Action para cancelar las subscripciones de stripe
 */
export const handleCancelStripeSubscription = async (
  subscriptionId: string
) => {
  try {
    const canceledSubscription = await stripe.subscriptions.cancel(
      subscriptionId
    );

    console.log("Subscripcion cancelada: ", canceledSubscription.id);

    revalidatePath("/payment/subscriptions");

    return { success: true, message: "Subscripcion Cancelada con Exito!!" };
  } catch (error) {
    console.error("Error al cancelar:", error);
    return { error: "Error al cancelar la suscripción" };
  }
};

/**
 *  Maneja el customer.subscription.deleted
 */
export const handleCustomerSubscriptionDeleted = async (
  sessionObj: Stripe.Customer.Shipping
) => {
  try {
    console.log("Iniciando handleCustomerSubscriptionDeleted");

    const subscriptionId = sessionObj.id;

    let user;

    if (subscriptionId) {
      user = await prisma.user.findFirst({
        where: { subscriptionId: subscriptionId },
      });

      if (user) {
        const updateUser = await prisma.user.update({
          where: { id: user.id },
          data: {
            pro: false,
            customerId: null,
            subscriptionId: null,
            priceId: null,
          },
        });

        console.log("Usuario actualizado a Pro:", updateUser);
        return updateUser;
      }
    }
  } catch (error) {
    console.error("Error al cancelar:", error);
    return { error: "Error al cancelar la suscripción" };
  }
};

/**
 * Maneja checkout.session.completed
 */
export async function handleCheckoutCompleted(
  sessionObj: Stripe.Checkout.Session
) {
  console.log("Iniciando handleCheckoutSessionCompleted");

  // 1️⃣ Si es suscripción → no necesitamos metadata.typeOfBuy
  if (sessionObj.mode === "subscription" && sessionObj.customer) {
    const priceId = sessionObj.line_items?.data[0].price?.id;
    const plan = stripePlans.find((p) => p.priceId === priceId);

    if (plan) {
      console.log("➡ Se detectó un plan Pro (suscripción)");
      return await handlePlanProUser(sessionObj, priceId!);
    }
  }

  // 2️⃣ Compras normales requieren typeOfBuy
  const typeOfBuy = sessionObj.metadata?.typeOfBuy;
  if (!typeOfBuy) {
    throw new Error("No se encontró el tipo de compra en metadata");
  }

  if (typeOfBuy === "COMPRAR-KIT") {
    return await handleKitPurchase(sessionObj);
  }
  if (typeOfBuy === "COMPRAR") {
    return await handleProductPurchase(sessionObj);
  }

  if (typeOfBuy === "DESTACAR") {
    return await handleProductDestacar(sessionObj);
  }

  throw new Error(`Tipo de compra desconocido: ${typeOfBuy}`);
}

async function handleProductPurchase(sessionObj: Stripe.Checkout.Session) {
  console.log("SessionObj de handleProductPurchase: ", sessionObj);

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
    const amountTotal = Number(productPrice);
    const feeAmount = Number(applicationFee) * 100; // centavos
    const vendorAmount = amountTotal - feeAmount;

    // Release en 20 días
    const releaseAt = new Date();
    releaseAt.setDate(releaseAt.getDate() + 20);

    // Cambiar estado del producto
    await prisma.product.update({
      where: { id: productId },
      data: { status: "vendido" },
    });

    // Obtener dirección
    const userAddress = await prisma.address.findUnique({
      where: { id: userAddressId },
    });
    if (!userAddress)
      throw new Error("No se encontró la dirección del usuario");

    // Crear orden con items
    const orden = await prisma.orden.create({
      data: {
        buyerId: userId,
        vendorId: vendedorId,
        stripeSessionId: sessionObj.id,
        stripePaymentIntent: sessionObj.payment_intent as string,
        amountTotal,
        vendorAmount,
        feeAmount,
        status: "paid",
        releaseAt,

        shippingCountry: userAddress.country,
        shippingCity: userAddress.city,
        shippingPostalCode: userAddress.postalCode,
        shippingAddressLine1: userAddress.street,
        shippingAddressLine2: userAddress.number,
        shippingName: userName,
        shippingPhone: userPhoneNumber,

        orderType: "PRODUCT", // es un producto individual
        items: {
          create: [
            {
              productId,
              quantity: 1,
            },
          ],
        },
      },
      include: {
        items: true, // opcional, si querés devolver los items creados
      },
    });

    return orden;
  } catch (error) {
    console.error("Error creando orden:", error);
    throw error;
  }
}

/**
 * Manejo de compra (producto o kit)
 */
async function handleKitPurchase(sessionObj: Stripe.Checkout.Session) {
  const userId = sessionObj.metadata?.buyerId;
  const vendedorId = sessionObj.metadata?.vendedorId;
  const vendedorConnectedAccountId =
    sessionObj.metadata?.vendedorConnectedAccountId;
  const applicationFee = sessionObj.metadata?.applicationFee;
  const totalPrice = sessionObj.amount_total;
  const userAddressId = sessionObj.metadata?.userAddressId;
  const userPhoneNumber = sessionObj.metadata?.userPhoneNumber;
  const userName = sessionObj.metadata?.userName;
  const typeOfBuy = sessionObj.metadata?.typeOfBuy;
  const kitId = sessionObj.metadata?.kitId;
  const productIds = sessionObj.metadata?.productIds
    ? JSON.parse(sessionObj.metadata.productIds)
    : [];

  if (
    !userId ||
    !vendedorId ||
    !vendedorConnectedAccountId ||
    !applicationFee ||
    !totalPrice ||
    !userAddressId ||
    !userPhoneNumber ||
    !userName
  ) {
    throw new Error("Error al crear la orden: faltan datos");
  }

  try {
    const amountTotal = Number(totalPrice);
    const feeAmount = Number(applicationFee) * 100; // centavos
    const vendorAmount = amountTotal - feeAmount;

    // Release en 20 días
    const releaseAt = new Date();
    releaseAt.setDate(releaseAt.getDate() + 20);

    // Obtener dirección
    const userAddress = await prisma.address.findUnique({
      where: { id: userAddressId },
    });
    if (!userAddress) {
      throw new Error("No se encontró la dirección del usuario");
    }

    // Crear la orden
    const orden = await prisma.orden.create({
      data: {
        buyerId: userId,
        vendorId: vendedorId,
        stripeSessionId: sessionObj.id,
        stripePaymentIntent: sessionObj.payment_intent as string,
        amountTotal,
        vendorAmount,
        feeAmount,
        status: "paid",
        releaseAt,

        shippingCountry: userAddress.country,
        shippingCity: userAddress.city,
        shippingPostalCode: userAddress.postalCode,
        shippingAddressLine1: userAddress.street,
        shippingAddressLine2: userAddress.number,
        shippingName: userName,
        shippingPhone: userPhoneNumber,
        orderType: typeOfBuy === "COMPRAR-KIT" ? "KIT" : "PRODUCT",
      },
    });

    // Crear OrderItems
    if (typeOfBuy === "COMPRAR-KIT" && kitId && productIds.length > 0) {
      // Marcar productos como vendidos
      await prisma.product.updateMany({
        where: { id: { in: productIds } },
        data: { status: "vendido" },
      });

      // Crear OrderItems del kit
      const orderItemsData = productIds.map((pid: string) => ({
        ordenId: orden.id,
        productId: pid,
        kitId,
        quantity: 1,
      }));
      await prisma.orderItem.createMany({ data: orderItemsData });
    } else if (typeOfBuy === "COMPRAR-PRODUCTO" && productIds.length === 1) {
      const productId = productIds[0];

      // Marcar producto como vendido
      await prisma.product.update({
        where: { id: productId },
        data: { status: "vendido" },
      });

      // Crear OrderItem
      await prisma.orderItem.create({
        data: {
          ordenId: orden.id,
          productId,
          quantity: 1,
        },
      });
    }

    return orden;
  } catch (error) {
    console.error("Error creando orden:", error);
    throw error;
  }
}

/**
 * Manejo para agregar el plan pro a un usuario
 */
async function handlePlanProUser(
  sessionObj: Stripe.Checkout.Session,
  priceId: string
) {
  try {
    const customerId = sessionObj.customer as string;
    const customer = await stripe.customers.retrieve(customerId);

    console.log("Se obtuvo el customer: ", customer);

    const plan = stripePlans.find((p) => p.priceId === priceId);
    if (!plan) {
      throw new Error("El priceId no corresponde a ningún plan válido");
    }

    let user;

    if ("email" in customer && customer.email) {
      user = await prisma.user.findUnique({
        where: { email: customer.email },
      });

      if (user) {
        const updateUser = await prisma.user.update({
          where: { id: user.id },
          data: {
            pro: true,
            customerId: customerId,
            subscriptionId: sessionObj.subscription?.toString(),
            priceId: plan.priceId,
          },
        });

        console.log("Usuario actualizado a Pro:", updateUser);
        return updateUser;
      }
    }

    throw new Error("No se encontró el usuario para este customer");
  } catch (err) {
    console.error("❌ Error en handlePlanProUser:", err);
    throw err;
  }
}

/**
 * Manejo de destacar producto
 */
async function handleProductDestacar(sessionObj: Stripe.Checkout.Session) {
  const { productId, days } = sessionObj.metadata || {};

  if (!productId || !days) {
    throw new Error("Error al destacar: faltan datos en metadata");
  }

  const daysNumber = Number(days);
  if (!Number.isInteger(daysNumber) || daysNumber <= 0) {
    throw new Error("Los días deben ser un número entero positivo");
  }

  try {
    // Fecha de vencimiento = hoy + days
    const featuredUntil = new Date();
    featuredUntil.setDate(featuredUntil.getDate() + daysNumber);

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        featuredUntil,
        // se marca cuándo fue destacado
        featuredAt: new Date(),
      },
    });

    console.log(
      `✅ Producto ${product.id} destacado hasta ${featuredUntil.toISOString()}`
    );

    return product;
  } catch (error) {
    console.error("❌ Error destacando producto:", error);
    throw error;
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
    // 1. Buscar el OrderItem activo para ese producto
    const orderItem = await prisma.orderItem.findFirst({
      where: {
        productId,
        orden: {
          status: "paid",
        },
      },
      include: {
        orden: {
          include: {
            vendor: {
              select: { connectedAccountId: true },
            },
          },
        },
      },
    });

    if (!orderItem) {
      console.error(
        "No se encontró una orden 'paid' para productId:",
        productId
      );
      return null;
    }

    const orden = orderItem.orden;

    if (!orden.vendor.connectedAccountId) {
      console.error("El vendedor no tiene connectedAccountId:", orden.vendorId);
      return null;
    }

    // 2. Hacer transferencia al vendedor en Stripe usando el vendorAmount ya calculado
    const transferencia = await stripe.transfers.create({
      amount: orden.vendorAmount, // en centavos
      currency: "eur",
      destination: orden.vendor.connectedAccountId,
      metadata: {
        orderId: orden.id,
        productId: orderItem.productId,
        motivo,
      },
    });

    // 3. Actualizar la orden como liberada
    const ordenLiberada = await prisma.orden.update({
      where: { id: orden.id },
      data: {
        payoutReleased: true,
        releasedAt: new Date(),
        stripeTransferId: transferencia.id,
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
