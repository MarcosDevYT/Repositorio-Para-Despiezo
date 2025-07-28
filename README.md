# Esquema de trabajo para Despiezo

## Stack Tecnológico

### Frontend

- **Next.js 15** - Framework de React (SSR/SSG)
- **React 19** - Librería JavaScript
- **TypeScript** - Tipado seguro aprueba de errores
- **Tailwind CSS** - Framework de estilos
- **Framer Motion** - Librería de animaciones
- **Three.js** - Librería para renderizado de modelos 3D
- **Shadcn/ui** - Librería de componentes reutilizables personalizables

### Autenticación

- **NextAuth.js v5** - Autenticación con email y Google OAuth

### Base de Datos & Backend

- **Supabase** - Base de datos relacional PostgreSQL
- **Prisma ORM** - Conexión y migración de modelos para la base de datos

### Funcionalidades

- **Tesseract.js** - OCR para reconocimiento de números OEM
- **Socket.io** - Para crear la comunicacion de chats en tiempo real
- **UploadThing** – Para cargar imágenes de los productos
- **Stripe** - Pasarela de pagos
- **Sendcloud API** - Gestión de envíos

### Hosting & Deployment

- **Vercel** - Hosting y deployment automático
- **GitHub** - Control de versiones (repositorio privado)

## Estructura del Proyecto

```
despiezo/
├── 📁 prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── 📁 public/
│   ├── models-3d/           # Archivos .glb de vehículos
│   ├── icons/
│   └── images/
├── 📁 src/
│   ├── 📁 app/              # Next.js App Router
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/
│   │   │   ├── profile/
│   │   │   ├── products/
│   │   │   ├── messages/
│   │   │   └── orders/
│   │   ├── search/
│   │   ├── product/
│   │   │   └── [id]/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── products/
│   │   │   ├── ocr/
│   │   │   ├── stripe/
|   |   |   ├── uploadthing/
│   │   │   ├── sendcloud/
│   │   │   └── dat-iberica/  # Preparado para integración
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── 📁 components/
│   │   ├── ui/              # Shadcn/ui components
│   │   ├── auth/
│   │   ├── products/
│   │   ├── search/
│   │   ├── chat/
│   │   ├── 3d-viewer/       # Componentes Three.js
│   │   └── ocr/
|   |
│   ├── 📁 lib/
│   │   ├── prisma.ts
│   │   ├── supabase.ts
│   │   ├── auth.ts          # NextAuth config
│   │   ├── stripe.ts
│   │   ├── sendcloud.ts
|   |   ├── uploadthing.ts
│   │   ├── dat-iberica.ts   # Preparado para API DAT
│   │   └── utils.ts
|   |
│   ├── 📁 hooks/
│   ├── 📁 types/
│   └── 📁 utils/
|
├── .env.local
├── .env.example
├── auth.ts
├── middleware.ts
├── next.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

## Plan de Desarrollo por Fases

### Fase 1: Maquetacion de la estructura inicial

1. **Setup inicial del proyecto**

   - Configuración Next.js + TypeScript
   - Setup Tailwind CSS y Shadcn/ui
   - Configuración Supabase + Prisma

2. **Sistema de autenticación**

   - NextAuth con email y Google
   - Páginas de login/registro
   - Middleware de protección de rutas

3. **Base de datos**
   - Configurar uploadThing para subir imagenes
   - Esquema Prisma completo
   - Migraciones iniciales
   - Seeding de datos de prueba

### Fase 2: Crud de productos

1. **Gestión de productos**

   - CRUD de productos con validación OEM obligatoria
   - Upload de imágenes
   - Sistema de categorías

2. **Buscador avanzado**

   - Filtros por marca, modelo, año, estado, etc.
   - Búsqueda por número OEM
   - Preparación para búsqueda por matrícula

3. **Sistema de compatibilidades**
   - Auto-registro de relaciones OEM ↔ Vehículo
   - Base orgánica de compatibilidades

### Fase 3: Funcionalidades Avanzadas

1. **Escáner OCR**

   - Implementación Tesseract.js
   - Reconocimiento de números OEM por cámara
   - Búsqueda automática post-reconocimiento

2. **Visor 3D**

   - Integración Three.js
   - Carga de modelos .glb
   - Sistema de resaltado de zonas

3. **Chat en tiempo real**
   - Socket.io para mensajería instantánea
   - Interface estilo Wallapop
   - Notificaciones push

### Fase 4: Integracion de pagos y envios

1. **Integración Stripe**

   - Procesamiento de pagos (modo test)
   - Gestión de transacciones
   - Webhooks para estados de pedido

2. **Integración Sendcloud**

   - Generación de etiquetas (modo test)
   - Tracking de envíos
   - Gestión de direcciones

3. **Panel de usuario completo**
   - Dashboard con métricas
   - Gestión de productos, ventas y compras
   - Historial de transacciones

### Fase 5: Preparación DAT Ibérica

1. **Estructura para integración DAT**

   - API endpoints preparados
   - Cache de consultas de matrículas
   - Interfaz de búsqueda por matrícula

2. **Testing y optimización**
   - Tests unitarios e integración
   - Optimización de rendimiento
   - Documentación completa

## Características del diseño UX/UI

### Diseño Responsive

- Diseño Mobile-first con Tailwind CSS
- Componentes adaptativos para todas las pantallas
- Navegación intuitiva tipo marketplace

### Animaciones con Framer Motion

- Transiciones suaves entre páginas
- Microinteracciones en botones y formularios
- Animaciones de carga y feedback visual

### Accesibilidad

- Navegación por teclado
- Contraste adecuado en todos los elementos

## Despliegue y Monitoreo

### Producción

- Vercel Production
- Supabase Production con backups automáticos
- Monitoreo con Vercel Analytics

## Entregables

1. **Código fuente completo** en repositorio privado
2. **README detallado** con instrucciones de setup
3. **Documentación técnica** de APIs y componentes
4. **Base de datos documentada** con diagramas ER
5. **Aplicación desplegada** en entorno de pruebas
6. **Carpeta de modelos 3D** organizados por marca/modelo
7. **Tests automatizados** para funcionalidades críticas

## Seguridad y Privacidad

- Validación de datos en cliente y servidor
- Sanitización de inputs para prevenir XSS
- Rate limiting en APIs críticas
- Encriptación de datos sensibles

---

Esta estructura está diseñada para ser escalable y permitir la integración futura de IA para sugerencias automáticas de compatibilidades, basándose en la base de datos orgánica que se construirá con las subidas de los usuarios.
