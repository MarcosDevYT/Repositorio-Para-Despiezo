"use server";

import { prisma } from "@/lib/prisma";
import { SendcloudResponse } from "@/types/ResponseType";

interface ParcelType {
  parcel: {
    name: string | null;
    company_name: string;
    address: string | null;
    house_number: string | null;
    city: string | null;
    postal_code: string | null;
    telephone: string | null;
    request_label: boolean;
    email: string;
    data: {};
    country: string;
    shipment: {
      id: number;
    };
    weight: number | null;
    order_number: string;
    insured_value: number;
    total_order_value_currency: string;
    total_order_value: string;
    quantity: number;
    shipping_method_checkout_name: string;
  };
}

export interface TrackingStatus {
  carrier_update_timestamp: string;
  parcel_status_history_id: string;
  parent_status: string;
  carrier_code: string;
  carrier_message: string;
}

export interface TrackingResponse {
  parcel_id: string;
  carrier_code: string;
  created_at: string;
  carrier_tracking_url: string;
  sendcloud_tracking_url: string | null;
  is_return: boolean;
  is_to_service_point: boolean;
  is_mail_box: boolean;
  expected_delivery_date: string;
  statuses: TrackingStatus[];
}

// Ruta para SendCloud
const sendCloudRoute = "https://panel.sendcloud.sc/api/v2";
const username = process.env.SENDCLOUD_PUBLIC_KEY!;
const password = process.env.SENDCLOUD_SECRET_KEY!;

/**
 * Funcion para obtener ordenes con paginacion
 */
export async function getOrders(page: number = 1, limit: number = 10) {
  try {
    const skip = (page - 1) * limit;

    const [ordenes, total] = await Promise.all([
      prisma.orden.findMany({
        include: {
          buyer: true,
          vendor: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" }, // opcional
      }),
      prisma.orden.count(),
    ]);

    return {
      ordenes,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error(error);
    return {
      ordenes: [],
      total: 0,
      page: 1,
      totalPages: 1,
    };
  }
}

/**
 * Funcion para obtener las ordenes del usuario (buyer)
 */
export async function getUserOrdens(userId: string) {
  try {
    if (!userId) return [];

    const ordenes = await prisma.orden.findMany({
      where: { buyerId: userId },
      include: {
        items: {
          include: {
            product: true,
            kit: true,
          },
        },
        vendor: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return ordenes;
  } catch (error) {
    console.error(error);
    return [];
  }
}

/**
 * Funcion para obtener las ordenes del vendedor
 */
export async function getVendedorOrdens(userId: string) {
  try {
    if (!userId) return [];

    const ordenes = await prisma.orden.findMany({
      where: { vendorId: userId },
      include: {
        items: {
          include: {
            product: true,
            kit: true,
          },
        },
        buyer: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return ordenes;
  } catch (error) {
    console.error(error);
    return [];
  }
}

/**
 * Funcion para obtener la orden por ID
 */
export async function getOrdenByID(orderId: string) {
  try {
    if (!orderId) return null;

    const orden = await prisma.orden.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
            kit: true,
          },
        },
        buyer: true,
        vendor: true,
      },
    });

    console.log(orden);

    return orden;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * Crear una etiqueta
 */
export async function createEtiqueta(parcelData: ParcelType) {
  try {
    const response = await fetch(
      `${sendCloudRoute}/parcels?errors=verbose-carrier`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            Buffer.from(username + ":" + password).toString("base64"),
        },
        body: JSON.stringify(parcelData),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error("Error creando etiqueta: " + errorText);
    }

    // Obtener el JSON de la respuesta
    const data: SendcloudResponse = await response.json();

    // Actualizar la orden con la info de la etiqueta
    await prisma.orden.update({
      where: { id: parcelData.parcel.order_number },
      data: {
        shippingLabelUrl: data.parcel.label.normal_printer[0],
        trackingNumber: data.parcel.tracking_number,
        trackingUrl: data.parcel.tracking_url,
      },
    });

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Error al crear la etiqueta");
  }
}

/**
 * Obtener seguimiento de la orden
 */
export async function getTrackingStatus(
  tracking_number: string
): Promise<TrackingResponse> {
  try {
    if (!tracking_number) {
      throw new Error("No se encontró el número de seguimiento de esta orden.");
    }

    const response = await fetch(
      `${sendCloudRoute}/tracking/${tracking_number}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization:
            "Basic " +
            Buffer.from(username + ":" + password).toString("base64"),
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error("Error obteniendo el estado del envío: " + errorText);
    }

    const data: TrackingResponse = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener el estado del envío");
  }
}

/**
 * Obtiene el PDF de la etiqueta desde Sendcloud como Buffer
 */
export async function getPDFParcel(ordenId: string): Promise<Buffer> {
  const orden = await prisma.orden.findUnique({
    where: { id: ordenId },
  });

  if (!orden?.shippingLabelUrl) {
    throw new Error("No se encontró la etiqueta para esta orden.");
  }

  const response = await fetch(`${orden.shippingLabelUrl}`, {
    method: "GET",
    headers: {
      Accept: "application/pdf",
      Authorization:
        "Basic " + Buffer.from(username + ":" + password).toString("base64"),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("Error obteniendo el PDF: " + errorText);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
