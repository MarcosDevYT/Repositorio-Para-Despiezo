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

## 📋 Funcionalidades Pendientes (Roadmap Detallado)

### 0. Cosas por hacer

- [ ] **Cron Job para Transferencias** - Crear un cron job que este atento a si pasan 20 dias o se entrego el pedido
- [ ] **Crear todos los skeletons de las paginas**
- [x] **Agregar un tabs en la tienda del vendedor** - En los tabs se van a visualizar los kits, productos y reseñas
- [x] **Agregar en el destacado las horas y los dias**
- [x] **Preparar caching de datos en el home y en los lugares que corresponda**
- [x] **Preparar las analiticas para despues agregar en la tienda y negocio del vendedor**
- [x] **Agregar input para banner en el negocio y agregar ese banner en la tienda si es que hay**
- [x] **Hacer diseño para la tienda, pensar si hacer un diseño pro y no pro**
- [ ] **Hero de busqueda con Tabs, pensado para buscar por oem o marca/modelo/año**
- [ ] **Agregar los badges correspondientes a las analiticas en el producto del vendedor**
- [ ] **Agregar traducciones a los estados del envio**

### Crear un boton y funcionalidad de reseñas

- [x] **Crear un boton en la compra del usuario para marcar como entregado**
- Este boton libera los fondos y le habilita el formulario de reseña y compatibilidades al usuario.
- [ ] **Crear los action para guardar reseñas y compatibilidades en la base de datos**
- [ ] **Esquematizar correctamente el sistema de compatibilidades de piezas**

### Tabs para buscar por marca/modelo/año

- Encontre una api que puede traerte todas las marcas, modelos de las marcas y podes encontrar modelos de las marcas por año.
- Pero no se pueden obtener de por si modelo/año juntos, solo se puede filtrar por el año
- Es una API totalmente gratuita y podemos cachear los resultados de todas las marcas y reutilizarlas en nuestro sistema

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
- [x] Dashboard con gráficas interactivas

### 👥 5. Validación por la Comunidad

- **Estado: Muy Importante - Alta Prioridad**

#### Sistema de Validación

- [ ] **Post-compra**: Pregunta si la pieza encajó (Sí/No)
- [ ] **Registro de compatibilidad**: Modelo/año/versión del vehículo
- [ ] **Mostrar en ficha**: "Validado por X usuarios en [Modelo/Año]"
- [ ] **Penalización**: Bajar ranking a vendedores con alta tasa de "No encajó"
- [ ] **Anti-fraude**: Solo compradores pueden validar, 1 por pedido

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
- [x] Agregar Checkout de Stripe

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

- [x] **Nuevo** - Nunca usado
- [x] **Como nuevo** - Perfectas condiciones
- [x] **En buen estado** - Usado pero bien conservado
- [x] **En condiciones aceptables** - Con signos de desgaste
- [x] **Lo ha dado todo** - Puede necesitar reparación

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
