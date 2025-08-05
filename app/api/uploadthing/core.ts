import { auth } from "@/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

/**
 * Configuracion de la ruta de uploadthing
 * @see https://docs.uploadthing.com/file-routes#route-config
 */
export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // Permisos y tipos de archivo para esta ruta
    .middleware(async ({ req }) => {
      const session = await auth();

      // Si no hay sesion o usuario, se lanza un error
      if (!session || !session.user) throw new UploadThingError("Unauthorized");

      // Lo que se retorna aqui es accesible en onUploadComplete como metadata
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Este codigo se ejecuta en el servidor despues de la subida
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.ufsUrl);

      // Lo que se retorna aqui es enviado al cliente en el callback `onClientUploadComplete`
      return { uploadedBy: metadata.userId };
    }),

  // Products Uploader
  productImageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 10,
    },
  })
    // Permisos y tipos de archivo para esta ruta
    .middleware(async ({ req }) => {
      const session = await auth();

      // Si no hay sesion o usuario, se lanza un error
      if (!session || !session.user) throw new UploadThingError("Unauthorized");

      // Lo que se retorna aqui es accesible en onUploadComplete como metadata
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Este codigo se ejecuta en el servidor despues de la subida
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.ufsUrl);

      // Lo que se retorna aqui es enviado al cliente en el callback `onClientUploadComplete`
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
