# Despiezo - Flutter App

App multiplataforma (Web + Android) para la plataforma de compra y venta de repuestos de vehículos **Despiezo**.

## Arquitectura

```
lib/
├── config/           # Configuración, tema, constantes, categorías
├── models/           # Modelos de datos (UserModel, ProductModel)
├── services/         # Servicios HTTP (ApiService, AuthService, ProductService)
├── providers/        # Estado global con Provider (AuthProvider, ProductProvider)
├── widgets/          # Widgets reutilizables (ProductCard, ProductGrid, CategoryBar)
├── screens/          # Pantallas principales
│   ├── main_shell.dart         # Shell con BottomNavigationBar
│   ├── home_screen.dart        # Inicio con productos destacados/populares/recientes
│   ├── search_screen.dart      # Búsqueda con filtros y sugerencias
│   ├── product_detail_screen.dart # Detalle de producto
│   ├── categories_screen.dart  # Explorar por categorías
│   ├── favorites_screen.dart   # Productos favoritos
│   ├── profile_screen.dart     # Perfil de usuario
│   ├── login_screen.dart       # Login
│   └── register_screen.dart    # Registro
└── main.dart         # Entry point
```

## API Endpoints (creados en Next.js)

La app consume los siguientes endpoints REST creados en `/api/mobile/`:

| Endpoint | Método | Descripción |
|---|---|---|
| `/api/mobile/auth/login` | POST | Login con email/password, retorna JWT |
| `/api/mobile/auth/register` | POST | Registro de usuario |
| `/api/mobile/auth/me` | GET | Obtener perfil del usuario autenticado |
| `/api/mobile/products` | GET | Listar productos con filtros y paginación |
| `/api/mobile/products/[id]` | GET | Detalle de producto + vendor + relacionados |
| `/api/mobile/products/featured` | GET | Productos destacados, recientes y populares |
| `/api/mobile/favorites` | GET/POST | Listar/toggle favoritos (requiere auth) |
| `/api/search/suggest` | GET | Sugerencias de búsqueda (endpoint existente) |
| `/api/marcas` | GET | Lista de marcas (endpoint existente) |
| `/api/modelos` | GET | Lista de modelos (endpoint existente) |

## Configuración

1. Editar `lib/config/api_config.dart` y cambiar `baseUrl` a la URL de tu servidor:

```dart
static const String baseUrl = 'https://despiezo.com';
```

2. Para desarrollo local, usar `http://localhost:3000`.

## Comandos

```bash
# Instalar dependencias
flutter pub get

# Ejecutar en web
flutter run -d chrome

# Ejecutar en Android (emulador o dispositivo)
flutter run -d android

# Build web
flutter build web --release

# Build APK Android
flutter build apk --release
```

## Funcionalidades implementadas

- **Autenticación**: Login/Registro con email y contraseña (JWT)
- **Home**: Productos destacados, populares y recientes en carruseles horizontales
- **Búsqueda**: Búsqueda por texto con sugerencias en tiempo real
- **Filtros**: Por categoría, estado, tipo de vehículo
- **Categorías**: Exploración por 9 categorías con subcategorías
- **Detalle de producto**: Galería de imágenes, info del vehículo, vendedor, productos relacionados
- **Favoritos**: Marcar/desmarcar productos como favoritos
- **Perfil**: Ver datos del usuario, stats, acceso a secciones

## Compatibilidad

- **Web**: Chrome, Firefox, Safari, Edge
- **Android**: API 21+ (Android 5.0+)
- **SDK**: Flutter 3.0.1+ / Dart 2.17.1+
