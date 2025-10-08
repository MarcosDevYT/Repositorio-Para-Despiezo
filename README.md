# Despiezo - Marketplace de Autopartes

Plataforma de compraventa de piezas de automóvil que conecta desguaces, talleres y particulares con compradores que buscan repuestos específicos.

## 🚀 Estado Actual vs. Roadmap

### ✅ Implementado

- Autenticación con NextAuth.js (email + Google OAuth)
- CRUD básico de productos
- Sistema de chat en tiempo real
- Integración con Stripe para pagos
- OCR para reconocimiento de números OEM
- Upload de imágenes con UploadThing
- Base de datos con Prisma + Supabase

### 🔄 En Desarrollo

- Mejoras de UX según documento de especificaciones
- Sistema de búsqueda inteligente
- Panel de control avanzado
- Validación por comunidad

## Stack Tecnológico

### Frontend

- **Next.js 15** - Framework de React (SSR/SSG)
- **React 19** - Librería JavaScript
- **TypeScript** - Tipado seguro
- **Tailwind CSS** - Framework de estilos
- **Framer Motion** - Animaciones
- **Shadcn/ui** - Componentes UI

### Backend & Base de Datos

- **Supabase** - PostgreSQL + Real-time
- **Prisma ORM** - Gestión de base de datos
- **NextAuth.js v5** - Autenticación

### Integraciones

- **Stripe** - Pasarela de pagos
- **Sendcloud API** - Gestión de envíos
- **UploadThing** - Gestión de archivos
- **Socket.io** - Chat en tiempo real
- **Chatgpt Image / Google Vision** - OCR para números OEM

### Deployment

- **Vercel** - Hosting y CI/CD
- **GitHub** - Control de versiones

## 📋 Funcionalidades Pendientes (Roadmap Detallado)

### 0. Implementar un cron Job

- [ ] **Cron Job para Transferencias** - Crear un cron job que este atento a si pasan 20 dias o se entrego el pedido

### 🏠 1. Transformación de la Página de Inicio

- **Estado: Pendiente**

#### Nuevas Secciones a Implementar

- [x] **Recomendaciones para ti** - Algoritmo de sugerencias basado en historial
- [x] **Lo más buscado** - Carrusel con búsquedas populares
- [x] **Recién llegados** - Últimas piezas subidas
- [x] **Productos Destacados** - Anuncios de pago con etiqueta "Patrocinado"
- [x] Reorganizar "Vistos recientemente" con las nuevas secciones

### 🔍 2. Sistema de Búsqueda Inteligente

- **Estado: Crítico - Alta Prioridad**

#### Autocompletado Inteligente

- [x] Sugerencias mixtas: modelos populares + números OEM + búsquedas populares
- [x] Chips visuales para diferenciar tipos de sugerencia
- [x] Tolerancia a errores tipográficos
- [x] Cambiar "VIN" por "número de referencia" en toda la UI

#### Filtros Persistentes

- [x] Filtros "sticky" que permanecen visibles al hacer scroll
- [x] Mantener estado al cambiar páginas/ordenar
- [x] Componente pegajoso en lateral (desktop) y barra horizontal (móvil)
- [x] Hacer en pantallas chicas el filtro sticky para poder abrir el sheet

### 🏷️ 3. Badges de Confianza y Métricas

- **Estado: Pendiente**

#### En Tarjetas de Producto

- [ ] Badge "Envío rápido" (basado en métricas reales)
- [ ] Badge "Responde rápido" (tiempo de respuesta en chat)
- [ ] Badge "Garantía de devolución"
- [x] Botón "Chat/Preguntar" directo en tarjeta

#### Datos Necesarios

- [ ] Tracking de tiempo de despacho por vendedor
- [ ] Métricas de tiempo de respuesta en chat
- [ ] Sistema de políticas de garantía por anuncio

### 📊 4. Panel de Control Inteligente

- **Estado: Pendiente**

#### Para Compradores

- [ ] **Rastreo integrado** - Timeline completo sin enlaces externos
- [ ] Estados: Confirmado → Preparación → Enviado → Reparto → Entregado
- [ ] Porcentaje de avance visual
- [ ] Botones "Hablar con vendedor" y "Abrir incidencia"
- [ ] Notificaciones push/email en cambios de estado

#### Para Vendedores PRO

- [ ] **Métricas de rendimiento**:
  - Tiempo de respuesta (gráficas semanales)
  - Velocidad de preparación/envío
  - Top piezas por beneficio y volumen
  - Tasa de devoluciones y motivos
  - Mapa de demanda por provincia
- [ ] Export CSV de métricas
- [ ] Dashboard con gráficas interactivas

### 👥 5. Validación por la Comunidad

- **Estado: Muy Importante - Alta Prioridad**

#### Sistema de Validación

- [ ] **Post-compra**: Pregunta si la pieza encajó (Sí/No)
- [ ] **Registro de compatibilidad**: Modelo/año/versión del vehículo
- [ ] **Mostrar en ficha**: "Validado por X usuarios en [Modelo/Año]"
- [ ] **Penalización**: Bajar ranking a vendedores con alta tasa de "No encajó"
- [ ] **Anti-fraude**: Solo compradores pueden validar, 1 por pedido

#### Modelo de Datos Necesario

```sql
reference_validations:
- order_id, user_id, reference_id, vehicle_id
- fit: boolean, reason: text, created_at
```

### 🏪 6. Monetización y Funciones PRO

- **Estado: Pendiente**

#### Productos Destacados

- [x] Sistema de anuncios de pago
- [x] Etiquetas "Destacado/Patrocinado"
- [x] Posicionamiento preferente en resultados
- [x] Identificador de destacado

#### Kits de Productos

- [x] Agrupar piezas complementarias
- [x] CRUD para crear/gestionar kits
- [x] Precio conjunto con descuento
- [ ] Agregar Checkout de Stripe

#### Cuotas PRO

- [x] Suscripción mensual para profesionales
- [ ] Subida masiva por CSV
- [ ] Análisis de mercado avanzado

### 💳 7. Mejoras de Pago y Confianza

- **Estado: Pendiente**

#### Pagos Rápidos

- [x] Integración Apple Pay
- [x] Integración Google Pay
- [x] Reducir fricción en checkout

#### Perfil de Vendedor Transparente

- [ ] Valoraciones detalladas por criterios
- [ ] Métricas de rendimiento visibles
- [ ] Historial de ventas y respuestas

### 📱 8. Mejoras de UX/UI

- **Estado: Pendiente**

#### Navegación Móvil

- [ ] Barra inferior fija: Inicio | Búsqueda | Subir | Chat | Perfil
- [ ] Navegación fluida optimizada para móvil

#### Footer Completo

- [ ] Enlaces: Acerca de, Soporte, Legal, Cuentas PRO
- [ ] Redes sociales y enlaces a apps
- [ ] Información de contacto y transparencia

### 🏷️ 9. Estados de Productos y Contadores

- **Estado: Pendiente**

#### Estados Definidos

- [ ] **Nuevo** - Nunca usado
- [ ] **Como nuevo** - Perfectas condiciones
- [ ] **En buen estado** - Usado pero bien conservado
- [ ] **En condiciones aceptables** - Con signos de desgaste
- [ ] **Lo ha dado todo** - Puede necesitar reparación

#### Implementación

- [ ] Contadores visibles en filtros y cabecera
- [ ] Desglose numérico por estado en resultados
- [ ] Badge "caja abierta" cuando aplique
- [ ] Filtro por "mejor estado"

### 🔧 10. Integraciones y APIs

- **Estado: Preparado para Futuro**

#### Sendcloud

- [ ] Webhooks para actualización automática de estados
- [ ] API integrada para tracking interno
- [ ] Gestión de incidencias

#### Preparación DAT Ibérica

- [ ] Estructura de API preparada
- [ ] Cache de consultas de matrículas
- [ ] Interfaz de búsqueda por matrícula

## 🎯 Criterios de Aceptación (QA)

### Búsqueda

- ✅ Autocompletado con mezcla de modelos, referencias y búsquedas populares
- ✅ Chips identificativos por tipo de sugerencia
- ✅ Filtros sticky y persistentes

### Productos

- ✅ Tarjetas con badges funcionales
- ✅ Botón de chat sin abrir ficha
- ✅ Contadores por estado en resultados

### Panel de Usuario

- ✅ Timeline interno sin enlaces externos
- ✅ Porcentaje de avance visual
- ✅ Dashboard PRO con KPIs y gráficas

### Validación Comunitaria

- ✅ Solo compradores pueden validar
- ✅ Desglose por modelo/año visible
- ✅ Sistema anti-fraude implementado

### Home

- ✅ Secciones: Recomendaciones + Lo más buscado + Recién llegados + Destacados

## 📁 Estructura del Proyecto

```typescript
despiezo/
├── 📁 .kiro/specs/          # Especificaciones de funcionalidades
├── 📁 prisma/
│   ├── schema.prisma
│   └── migrations/
├── 📁 app/
│   ├── (auth)/
│   ├── (routes)/
│   ├── api/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── 📁 components/
│   ├── ui/                  # Shadcn/ui components
│   ├── searchComponents/
│   ├── chatComponents/
│   └── LoginComponents/
├── 📁 lib/
│   ├── prisma.ts
│   ├── stripe.ts
│   ├── utils.ts
│   └── zodSchemas/
├── 📁 actions/              # Server actions
├── 📁 hooks/                # Custom hooks
├── 📁 types/                # TypeScript types
└── 📁 public/               # Static assets
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

2. **Chat en tiempo real**
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

## 🚀 Plan de Implementación por Prioridades

### 🔥 Prioridad CRÍTICA (Implementar Primero)

#### 1. Sistema de Búsqueda Inteligente

- **Autocompletado con sugerencias mixtas**
- **Filtros persistentes (sticky)**
- **Cambio de "VIN" a "número de referencia"**

#### 2. Validación por la Comunidad

- **Sistema post-compra de validación**
- **Modelo de datos reference_validations**
- **Mostrar validaciones en fichas de producto**

#### 3. Contadores de Estado en Resultados

- **Mostrar "X Nuevas, Y Como nuevas, Z Usadas"**
- **Filtros por estado con contadores**
- **Estados claramente definidos**

### ⚡ Prioridad ALTA (Siguiente Sprint)

#### 4. Transformación del Home

- **Secciones: Recomendaciones + Lo más buscado + Recién llegados**
- **Productos destacados/patrocinados**
- **Algoritmo de recomendaciones básico**

#### 5. Badges de Confianza

- **Badges en tarjetas: envío rápido, respuesta rápida, garantía**
- **Botón de chat directo en tarjeta**
- **Métricas de vendedor**

#### 6. Panel de Control Inteligente

- **Timeline de pedidos interno**
- **Dashboard PRO con métricas**
- **Notificaciones de estado**

### 📈 Prioridad MEDIA (Siguientes Iteraciones)

#### 7. Monetización

- **Sistema de productos destacados**
- **Kits de productos**
- **Cuotas PRO**

#### 8. Mejoras de Pago

- **Apple Pay / Google Pay**
- **Perfil de vendedor transparente**

#### 9. UX/UI

- **Barra de navegación móvil**
- **Footer completo**

### 🔮 Prioridad BAJA (Futuro)

#### 10. Integraciones Avanzadas

- **Webhooks Sendcloud**
- **Preparación DAT Ibérica**
- **Analytics avanzados**

## 🛠️ Guía de Implementación Técnica

### Cambios Inmediatos Requeridos

#### 1. Terminología

```typescript
// ❌ Cambiar esto:
"VIN" → "Número de referencia"

// ✅ Por esto en toda la UI:
"Número de referencia (OEM)"
```

#### 2. Modelo de Datos - Validación Comunitaria

```sql
-- Nueva tabla requerida:
CREATE TABLE reference_validations (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  user_id INTEGER REFERENCES users(id),
  reference_id INTEGER REFERENCES products(id),
  vehicle_id INTEGER REFERENCES vehicles(id),
  fit BOOLEAN NOT NULL,
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. Endpoints de API Necesarios

```typescript
// Autocompletado inteligente
GET /api/search/suggest?q=golf
// Respuesta: {type: 'model'|'reference'|'popular', label: string}[]

// Contadores por estado
GET /api/products/search?filters=...
// Respuesta: {results: Product[], counts_by_condition: {new: 15, like_new: 450, ...}}

// Métricas de vendedor
GET /api/sellers/:id/metrics
// Respuesta: {response_time: number, shipping_speed: number, ...}
```

### Componentes UI Prioritarios

#### 1. SearchAutocomplete

- Sugerencias mixtas con chips
- Tolerancia a errores tipográficos
- Histórico de búsquedas populares

#### 2. StickyFilters

- Componente pegajoso en scroll
- Persistencia de estado en URL
- Responsive (lateral desktop, horizontal móvil)

#### 3. ProductCard con Badges

- Badges de confianza
- Botón de chat directo
- Estados claramente visibles

#### 4. OrderTimeline

- Timeline visual de estados
- Porcentaje de progreso
- Acciones contextuales

## 📊 Métricas y KPIs a Trackear

### Para Vendedores

- Tiempo medio de respuesta en chat
- Velocidad de preparación/envío (% <24h)
- Tasa de "no encajó" por referencia
- Valoraciones por criterio

### Para la Plataforma

- Búsquedas populares (para autocompletado)
- Tasa de conversión por tipo de badge
- Engagement en secciones del home
- Validaciones comunitarias por producto

## 🎯 Criterios de Éxito

### Busqueda

- ✅ Autocompletado responde <200ms
- ✅ Filtros mantienen estado al navegar
- ✅ 0 referencias a "VIN" en UI

### Validacion Comunitaria

- ✅ >70% de compradores validan compatibilidad
- ✅ Reducción 30% en devoluciones por incompatibilidad
- ✅ Aumento confianza del comprador

### Home Dinámico

- ✅ Aumento 25% tiempo en página
- ✅ Mejora 15% tasa de clics a productos
- ✅ Sensación de "marketplace activo"

### Panel de Control

- ✅ Reducción 50% consultas de "¿dónde está mi pedido?"
- ✅ Vendedores PRO usan métricas semanalmente
- ✅ 0 enlaces externos para tracking

## 🚨 Notas Importantes para Desarrollo

1. **Modularidad**: Mantener código preparado para reactivar funciones futuras
2. **Performance**: Cachear búsquedas populares y sugerencias
3. **SEO**: URLs amigables con filtros persistentes
4. **Analytics**: Trackear todas las interacciones para optimizar algoritmos
5. **Testing**: Priorizar tests en búsqueda y validación comunitaria

---

**Próximo paso**: Comenzar con el sistema de búsqueda inteligente y autocompletado, ya que es la base para muchas otras funcionalidades.
