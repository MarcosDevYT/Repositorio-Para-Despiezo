import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY!,
});

const sentFrom = new Sender(
  "despiezo@test-3m5jgrodmj0gdpyo.mlsender.net",
  "Despiezo"
);

export const sendEmailVerification = async (email: string, token: string) => {
  const recipients = [new Recipient(email, "")];

  // URL de verificación
  const url = `${process.env.NEXT_PUBLIC_URL}/api/auth/verify-email?token=${token}`;

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject("Verifica tu email")
    .setHtml(
      `
          <p>Haz click en el siguiente enlace para verificar tu email:</p>
          <p>
            <a href="${url}">${url}</a>
          </p>
          <p>Si no solicitaste este email, por favor ignora este mensaje.</p>
          `
    );

  try {
    await mailerSend.email.send(emailParams);
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Error al enviar email" };
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const recipients = [new Recipient(email, "")];

  // URL de verificación
  const url = `${process.env.NEXT_PUBLIC_URL}/reset-password?token=${token}`;

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject("Restablece tu contraseña")
    .setHtml(
      `
      <p>
        Haz clic en el siguiente enlace para restablecer tu contraseña:
        <a href="${url}">
          Restablecer contraseña
        </a>
      </p>
      <p>
        Si no solicitaste este correo, puedes ignorarlo.
      </p>
      `
    );

  try {
    await mailerSend.email.send(emailParams);
    return { success: true };
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    return { error: "Error al enviar el correo" };
  }
};
