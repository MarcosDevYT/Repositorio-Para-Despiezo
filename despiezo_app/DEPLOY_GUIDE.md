# Guía de Despliegue - Despiezo App (Flutter)

Este documento contiene las instrucciones paso a paso para compilar y desplegar la aplicación web en distintas plataformas (Cloudflare, aaPanel, Dokploy y Docker), así como la generación del APK para Android en Windows 11 y Ubuntu/Linux Mint.

---

## ⚠️ Paso Cero: Preparación de la API

Antes de compilar la app (Web o APK), asegúrate de que la URL de tu API esté configurada correctamente apuntando a tu backend de Next.js en producción.

Abre `lib/config/api_config.dart` y verifica:
```dart
class ApiConfig {
  static const String baseUrl = 'https://tudominio.com'; // <-- CAMBIAR A TU URL REAL
  // ...
}
```

---

## 🌐 Parte 1: Compilación y Despliegue de Flutter Web

El primer paso para cualquier servidor web es generar los archivos estáticos de producción.

En la terminal, dentro de la carpeta `despiezo_app`, ejecuta:
```bash
flutter clean
flutter pub get
flutter build web --release
```

Esto creará una carpeta en `build/web/` con los archivos estáticos listos para subir (`index.html`, `main.dart.js`, assets, etc.).

---

### Método 1: Despliegue en Cloudflare Pages (Recomendado)

Es la forma más rápida, gratuita y con CDN global.

**Opción A: Direct Upload (Drag & Drop)**
1. Inicia sesión en Cloudflare y ve a **Workers & Pages**.
2. Haz clic en **Create application** → **Pages** → **Upload assets**.
3. Ponle un nombre a tu proyecto (ej: `despiezo-app`).
4. Arrastra y suelta la carpeta entera `build/web/` (generada anteriormente) al recuadro de subida.
5. Haz clic en **Deploy**. Cloudflare te dará una URL (ej: `despiezo-app.pages.dev`).

**Opción B: Usando Wrangler CLI (Consola)**
1. Instala Wrangler usando Node.js: `npm install -g wrangler`
2. Autentícate: `npx wrangler login`
3. Despliega: `npx wrangler pages deploy build/web --project-name=despiezo-app`

---

### Método 2: Despliegue en aaPanel

Si tienes un VPS propio manejado con aaPanel.

1. Entra a tu aaPanel y ve a la sección **Website**.
2. Haz clic en **Add site**. Ingresa el dominio (ej. `app.despiezo.com`), selecciona PHP (versión no importa para esto) y dale a Submit.
3. Configura el certificado SSL (Let's Encrypt) en la configuración del sitio web.
4. Ve al **File Manager** (Archivos) y entra a la carpeta raíz de tu sitio (`/www/wwwroot/app.despiezo.com`).
5. Elimina el archivo `index.html` por defecto de aaPanel.
6. Comprime la carpeta `build/web/` de tu PC en un archivo `.zip` (contenido dentro del zip, asegúrate de que `index.html` esté en la raíz del zip, no dentro de otra carpeta).
7. Sube el archivo `.zip` al File Manager de aaPanel y extráelo.
8. Entra a tu dominio para verificar.

---

### Método 3: Despliegue en Dokploy

Dokploy es un PaaS auto-alojado similar a Vercel/Render.

**Método usando Nginx y Dockerfile (Más confiable)**
Para que el routing funcione bien en Dokploy, la mejor opción es desplegarlo mediante Docker.

1. En tu Dokploy, ve a **Applications** → **Create Application**.
2. Conecta tu repositorio Git donde tengas `despiezo_app`.
3. En Build Type, selecciona **Docker**.
4. Pega el `Dockerfile` (indicado en el Método 4) en la raíz de `despiezo_app/` y commitealo a Git.
5. Asigna tu dominio en Dokploy y habilita SSL.
6. Haz clic en **Deploy**. Dokploy construirá Flutter y levantará el contenedor Nginx automáticamente.

---

### Método 4: Despliegue con Docker / Docker Compose

Si manejas tu propio servidor con Docker o portainer.

1. Crea un archivo llamado `Dockerfile` dentro de la carpeta `despiezo_app` con este contenido:

```dockerfile
# Stage 1: Construir app Flutter
FROM ubuntu:20.04 AS build-env

# Instalar dependencias de Flutter
RUN apt-get update && apt-get install -y curl git unzip xz-utils zip libglu1-mesa
RUN useradd -ms /bin/bash builder
USER builder
WORKDIR /home/builder

# Descargar Flutter
RUN git clone https://github.com/flutter/flutter.git -b stable
ENV PATH="/home/builder/flutter/bin:/home/builder/flutter/bin/cache/dart-sdk/bin:${PATH}"

# Copiar archivos
COPY --chown=builder:builder . /app
WORKDIR /app

# Construir
RUN flutter clean
RUN flutter pub get
RUN flutter build web --release

# Stage 2: Servidor Nginx
FROM nginx:alpine
COPY --from=build-env /app/build/web /usr/share/nginx/html

# Configuración básica Nginx para SPA (Single Page Application routing)
RUN echo "server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files \$uri \$uri/ /index.html; \
    } \
}" > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. Construye la imagen:
```bash
docker build -t despiezo-web .
```

3. Levanta el contenedor:
```bash
docker run -d -p 8080:80 --name mi-app-despiezo despiezo-web
```
Ahora la app web está corriendo en el puerto 8080 de tu servidor.

---

## 📱 Parte 2: Generación del APK (Android)

### En Windows 11

**Requisitos Previos:**
1. Descarga el SDK de **Flutter** para Windows y agrégalo a la variable de entorno `PATH`.
2. Instala **Android Studio**.
3. Abre Android Studio → *SDK Manager* (icono de cubo arriba a la derecha). En la pestaña **SDK Tools**, marca e instala **Android SDK Command-line Tools (latest)**.

**Paso a paso:**
1. Abre tu terminal (PowerShell o CMD) como Administrador.
2. Acepta las licencias de Android:
   ```cmd
   flutter doctor --android-licenses
   ```
   (Presiona 'y' y Enter para todas las preguntas).
3. Asegúrate de que todo esté correcto ejecutando:
   ```cmd
   flutter doctor
   ```
4. Navega a tu carpeta `despiezo_app`:
   ```cmd
   cd C:\Ruta\A\Tu\Repositorio-Para-Despiezo\despiezo_app
   ```
5. Instala las dependencias y construye el APK:
   ```cmd
   flutter clean
   flutter pub get
   flutter build apk --release
   ```
6. ¡Listo! Tu archivo APK compilado y firmado por defecto se encontrará en:
   `despiezo_app\build\app\outputs\flutter-apk\app-release.apk`

---

### En Linux Mint / Ubuntu

**Requisitos Previos:**
1. Instala las dependencias principales en terminal:
   ```bash
   sudo apt update
   sudo apt install -y curl git unzip xz-utils zip libglu1-mesa clang cmake ninja-build pkg-config libgtk-3-dev
   ```
2. Instala Flutter (vía snap o tar):
   ```bash
   sudo snap install flutter --classic
   ```
3. Instala Android Studio (puedes instalarlo vía snap también):
   ```bash
   sudo snap install android-studio --classic
   ```
4. Abre Android Studio una vez para que descargue el SDK básico. Ve al **SDK Manager** → **SDK Tools** y marca **Android SDK Command-line Tools (latest)**. Instálalo.

**Paso a paso:**
1. Acepta las licencias de Android:
   ```bash
   flutter doctor --android-licenses
   ```
   (Escribe 'y' en todo).
2. Ve a la carpeta de tu proyecto:
   ```bash
   cd /ruta/a/tu/Repositorio-Para-Despiezo/despiezo_app
   ```
3. Ejecuta la compilación:
   ```bash
   flutter clean
   flutter pub get
   flutter build apk --release
   ```
4. ¡Listo! El APK estará disponible en la ruta:
   `despiezo_app/build/app/outputs/flutter-apk/app-release.apk`
