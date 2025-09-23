import { getOrders } from "@/actions/order-actions";
import { auth } from "@/auth";
import { MainContainer } from "@/components/layout/MainContainer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReleasePaidButton } from "@/components/ReleasePaidButton";

export const adminEmails = [
  "marcosmoruadev@gmail.com",
  "nacho.cervantes2@gmail.com",
];

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const { page } = await searchParams;

  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!adminEmails.includes(session.user.email!)) {
    redirect("/");
  }

  const numberPage = Number(page) || 1;
  const limit = 5; // cantidad por página

  const { ordenes, totalPages } = await getOrders(numberPage, limit);

  return (
    <MainContainer className="container mx-auto px-4 py-8 md:py-16 flex flex-col gap-4 min-h-[82.5vh]">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Panel de administrador
          </CardTitle>
          <CardDescription>
            Aqui se puede administrar, gestionar las ordenes de lo usuarios y
            liberar los pagos al vendedor.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Órdenes</CardTitle>
          <CardDescription>
            Página {numberPage} de {totalPages}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="border border-border rounded-lg">
            <Table className="w-full mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-sm text-start">ID</TableHead>
                  <TableHead className="px-2 text-start">Cliente</TableHead>
                  <TableHead className="px-2 text-start">Vendedor</TableHead>
                  <TableHead className="px-2 text-start">
                    Numero de orden
                  </TableHead>

                  <TableHead className="px-2 text-start">Total</TableHead>
                  <TableHead className="px-2 text-start">Fecha</TableHead>

                  <TableHead className="px-2 text-end">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordenes.map((orden) => (
                  <TableRow key={orden.id} className="text-center">
                    <TableCell className="text-sm text-start w-max">
                      {orden.id}
                    </TableCell>
                    <TableCell className="px-2 text-start">
                      {orden.buyer.name}
                    </TableCell>
                    <TableCell className="px-2 text-start">
                      {orden.vendor.businessName}
                    </TableCell>

                    <TableCell className="px-2 text-start">
                      {orden.trackingNumber}
                    </TableCell>

                    <TableCell className="px-2 text-start">
                      ${orden.amountTotal}
                    </TableCell>
                    <TableCell className="px-2 text-start">
                      {new Date(orden.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="px-2 text-end">
                      {orden.releasedAt ? (
                        <div className="p-2 px-3 rounded-xl bg-green-500 text-white text-base font-medium">
                          Pago Liberado
                        </div>
                      ) : (
                        <ReleasePaidButton orden={orden} />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Paginación */}
          <div className="flex justify-between items-center mt-4">
            {numberPage > 1 ? (
              <Link
                href={`?page=${numberPage - 1}`}
                className="px-4 py-2 border rounded-lg hover:bg-muted"
              >
                Anterior
              </Link>
            ) : (
              <span />
            )}

            {numberPage < totalPages && (
              <Link
                href={`?page=${numberPage + 1}`}
                className="px-4 py-2 border rounded-lg hover:bg-muted"
              >
                Siguiente
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </MainContainer>
  );
}
