import {
  createStripeAccountLinkAction,
  getStripeDashboardLinkAction,
} from "@/actions/user-actions";
import { SubmitButton } from "@/components/SubmitButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LucideCheckCircle2,
  LucideAlertCircle,
  CreditCardIcon,
} from "lucide-react";
import { Session } from "next-auth";

export const ProfileConfiguracion = async ({
  session,
}: {
  session: Session;
}) => {
  const user = session.user;
  const isConnected = user.stripeConnectedLinked;

  return (
    <Card className="w-full h-fit">
      <CardHeader className="relative">
        <CardTitle className="text-2xl font-bold">
          Configuración de Pago
        </CardTitle>
        <CardDescription>
          Aquí puedes gestionar tu cuenta y conectarla con Stripe para recibir
          pagos
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="w-full my-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-sky-500 to-blue-500 flex items-center justify-center mr-4">
              <CreditCardIcon className="text-white w-5 h-5" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary">
                Stripe Connect
              </h2>
              <p className="text-sm text-muted-foreground">
                {isConnected
                  ? "Tu cuenta de Stripe está conectada"
                  : "Conecta tu cuenta de Stripe para empezar a recibir pagos"}
              </p>
            </div>
          </div>

          <div
            className={`my-6 p-4 rounded-md ${isConnected ? "bg-green-100" : "bg-yellow-100"}`}
          >
            <div className="flex items-start">
              {isConnected ? (
                <LucideCheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
              ) : (
                <LucideAlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
              )}

              <div>
                <p className="font-medium">
                  {isConnected
                    ? "Puedes aceptar pagos a través de tu aplicación"
                    : "Necesitas conectar tu cuenta de Stripe para procesar pagos"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              {isConnected
                ? "Puedes reconectar tu cuenta si es necesario"
                : "Serás redirigido a Stripe para completar la conexión"}
            </div>

            {isConnected ? (
              <form action={getStripeDashboardLinkAction}>
                <SubmitButton title="Ver Panel de Control" />
              </form>
            ) : (
              <form action={createStripeAccountLinkAction}>
                <SubmitButton title="Conectar con Stripe" />
              </form>
            )}
          </div>

          {!isConnected && (
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="text-sm font-medium mb-2">
                ¿Por qué conectar con Stripe?
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  </div>
                  Recibe pagos de forma segura de tus clientes
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  </div>
                  Gestiona suscripciones y facturación recurrente
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  </div>
                  Accede a reportes financieros detallados y análisis
                </li>
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
