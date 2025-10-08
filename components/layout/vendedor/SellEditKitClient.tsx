"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { SellKitForm } from "./SellKitForm";
import { Kit, Product } from "@prisma/client";
import { updateKit } from "@/actions/kit-actions";

interface Props {
  products: Product[];
  initialValues?:
    | Partial<{
        name: string;
        description: string;
        discount: number;
        productIds: string[];
      }>
    | undefined;
  kit: Kit;
}

export default function SellEditKitClient({
  products,
  initialValues,
  kit,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Crear Producto</CardTitle>
        <CardDescription>Crea un nuevo producto para vender</CardDescription>
      </CardHeader>

      <CardContent>
        <SellKitForm
          products={products}
          action={(data) => updateKit(kit.id, data)}
          mode="edit"
          initialValues={initialValues}
        />
      </CardContent>
    </Card>
  );
}
