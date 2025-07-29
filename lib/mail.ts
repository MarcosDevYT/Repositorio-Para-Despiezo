import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmailVerification = async (email: string, token: string) => {
  try {
    console.log("Enviando email de verificación a:", email);
    console.log("Token de verificación:", token);

    // URL de verificación
    const url = `${process.env.NEXT_PUBLIC_URL}/api/auth/verify-email?token=${token}`;

    await resend.emails.send({
      from: "Despiezo <onboarding@resend.dev>",
      to: email,
      subject: "Verifica tu email",
      html: `
        <p>Haz click en el siguiente enlace para verificar tu email:</p>
        <p><a href="${url}">${url}</a></p>
        <p>Si no solicitaste este email, por favor ignora este mensaje.</p>
      `
    });

    console.log("Email enviado correctamente");

    return { success: true };

  } catch (error) {
    console.error("Error al enviar correo:", error);

    return {
      error: "Error al enviar el email de verificación"
    };
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  try {
    await resend.emails.send({
      from: "Despiezo <onboarding@resend.dev>",
      to: email,
      subject: "Restablece tu contraseña",
      html: `
        <p>
          Haz clic en el siguiente enlace para restablecer tu contraseña:
          <a href="${process.env.NEXT_PUBLIC_URL}/reset-password?token=${token}">
            Restablecer contraseña
          </a>
        </p>
        <p>
          Si no solicitaste este correo, puedes ignorarlo.
        </p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    return { error: "Error al enviar el correo" };
  }
};