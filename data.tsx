import {
  Heart,
  MessageCircleMore,
  Package,
  ShoppingBag,
  ShoppingCart,
  User,
  Car,
  Disc3,
  Filter,
  Fuel,
  Gauge,
  LucideListFilter,
  Settings,
  Wrench,
  Zap,
  Cog,
  Cpu,
  Thermometer,
  Wind,
  LucideShoppingBag,
} from "lucide-react";

/**
 * @description Array de links para el perfil del usuario
 * @info array para el componente ProfileLinks
 */
export const ProfileNavLinks = [
  {
    label: "Perfil",
    href: "/profile",
    icon: <User />,
  },
  {
    label: "Mensajes",
    href: "/inbox",
    icon: <MessageCircleMore />,
  },
  {
    label: "Favoritos",
    href: "/profile/favorites",
    icon: <Heart />,
  },
  {
    label: "Mis Compras",
    href: "/profile/shoppings",
    icon: <ShoppingBag />,
  },
  {
    label: "Mis Productos",
    href: "/sell",
    icon: <Package />,
  },
  {
    label: "Mis Ventas",
    href: "/sell/sales",
    icon: <ShoppingCart />,
  },
  {
    label: "Configuracion",
    href: "/profile/settings",
    icon: <Settings />,
  },
];

/**
 * @description Array de links para el dropdown del usuario
 * @info array para el componente UserDropdown
 */
export const DropdownLinks = [
  {
    title: "Perfil",
    links: [
      {
        label: "Perfil",
        href: "/profile",
        icon: <User className="size-4" strokeWidth={2.5} />,
      },
      {
        label: "Mensajes",
        href: "/inbox",
        icon: <MessageCircleMore className="size-4" strokeWidth={2.5} />,
      },
      {
        label: "Favoritos",
        href: "/profile/favorites",
        icon: <Heart className="size-4" strokeWidth={2.5} />,
      },
      {
        label: "Mis Compras",
        href: "/profile/shoppings",
        icon: <ShoppingBag className="size-4" strokeWidth={2.5} />,
      },
    ],
  },
  {
    title: "Vender",
    links: [
      {
        label: "Mis Productos",
        href: "/sell",
        icon: <Package className="size-4" strokeWidth={2.5} />,
      },
      {
        label: "Mis Ventas",
        href: "/sell/sales",
        icon: <ShoppingCart className="size-4" strokeWidth={2.5} />,
      },
    ],
  },
  {
    title: "Configuracion",
    links: [
      {
        label: "Configuracion",
        href: "/profile/settings",
        icon: <Settings className="size-4" strokeWidth={2.5} />,
      },
    ],
  },
];

export const categories = [
  {
    id: 1,
    name: "Todos los productos",
    slug: "todas-las-categorias",
    icon: LucideShoppingBag,
  },
  {
    id: 2,
    name: "Motor",
    slug: "motor",
    icon: Car,
    subcategories: [
      { id: "m1", name: "Bloque de motor", slug: "bloque-de-motor" },
      { id: "m2", name: "Culata", slug: "culata" },
      { id: "m3", name: "Pistones", slug: "pistones" },
      { id: "m4", name: "Válvulas", slug: "valvulas" },
      { id: "m5", name: "Cigüeñal", slug: "ciguenal" },
      {
        id: "m6",
        name: "Correa / Cadena de distribución",
        slug: "correa-cadena-de-distribucion",
      },
    ],
  },
  {
    id: 3,
    name: "Frenos",
    slug: "frenos",
    icon: Disc3,
    subcategories: [
      { id: "f1", name: "Discos", slug: "discos" },
      { id: "f2", name: "Pastillas", slug: "pastillas" },
      { id: "f3", name: "Calipers", slug: "calipers" },
      {
        id: "f4",
        name: "Bombín / cilindro maestro",
        slug: "bomin-cilindro-maestro",
      },
      { id: "f5", name: "ABS", slug: "abs" },
    ],
  },
  {
    id: 4,
    name: "Suspensión",
    slug: "suspension",
    icon: Settings,
    subcategories: [
      { id: "s1", name: "Amortiguadores", slug: "amortiguadores" },
      { id: "s2", name: "Resortes", slug: "resortes" },
      { id: "s3", name: "Bujes", slug: "bujes" },
      { id: "s4", name: "Brazos de suspensión", slug: "brazos-de-suspension" },
      { id: "s5", name: "Barra estabilizadora", slug: "barra-estabilizadora" },
    ],
  },
  {
    id: 5,
    name: "Sistema Eléctrico",
    slug: "sistema-electrico",
    icon: Zap,
    subcategories: [
      { id: "e1", name: "Alternadores", slug: "alternadores" },
      { id: "e2", name: "Motores de arranque", slug: "motores-de-arranque" },
      { id: "e3", name: "Baterías", slug: "baterias" },
      { id: "e4", name: "Sensores", slug: "sensores" },
      { id: "e5", name: "Fusibles y relés", slug: "fusibles-y-reles" },
    ],
  },
  {
    id: 6,
    name: "Filtros",
    slug: "filtros",
    icon: Filter,
    subcategories: [
      { id: "fi1", name: "Filtro de aire", slug: "filtro-de-aire" },
      { id: "fi2", name: "Filtro de aceite", slug: "filtro-de-aceite" },
      {
        id: "fi3",
        name: "Filtro de combustible",
        slug: "filtro-de-combustible",
      },
      { id: "fi4", name: "Filtro de cabina", slug: "filtro-de-cabina" },
    ],
  },
  {
    id: 7,
    name: "Combustible",
    slug: "combustible",
    icon: Fuel,
    subcategories: [
      { id: "c1", name: "Inyectores", slug: "inyectores" },
      { id: "c2", name: "Bomba de combustible", slug: "bomba-de-combustible" },
      { id: "c3", name: "Carburador", slug: "carburador" },
      { id: "c4", name: "Riel de inyección", slug: "riel-de-inyeccion" },
      { id: "c5", name: "Regulador de presión", slug: "regulador-de-presion" },
    ],
  },
  {
    id: 8,
    name: "Instrumentos",
    slug: "instrumentos",
    icon: Gauge,
    subcategories: [
      { id: "i1", name: "Velocímetro", slug: "velocimetro" },
      { id: "i2", name: "Tacómetro", slug: "tacometro" },
      {
        id: "i3",
        name: "Indicador de combustible",
        slug: "indicador-de-combustible",
      },
      { id: "i4", name: "Tablero completo", slug: "tablero-completo" },
    ],
  },
  {
    id: 9,
    name: "Herramientas",
    slug: "herramientas",
    icon: Wrench,
    subcategories: [
      { id: "h1", name: "Llaves", slug: "llaves" },
      { id: "h2", name: "Gatos hidráulicos", slug: "gatos-hidraulicos" },
      {
        id: "h3",
        name: "Cajas de herramientas",
        slug: "cajas-de-herramientas",
      },
      { id: "h4", name: "Multímetros", slug: "multimetros" },
      { id: "h5", name: "Compresores", slug: "compresores" },
    ],
  },
  {
    id: 10,
    name: "Transmisión",
    slug: "transmision",
    icon: Cog,
    subcategories: [
      { id: "t1", name: "Caja de cambios", slug: "caja-de-cambios" },
      { id: "t2", name: "Embrague", slug: "embrague" },
      { id: "t3", name: "Cardanes y ejes", slug: "cardanes-y-ejes" },
    ],
  },
  {
    id: 11,
    name: "Electrónica",
    slug: "electronica",
    icon: Cpu,
    subcategories: [
      { id: "el1", name: "ECU", slug: "ecu" },
      {
        id: "el2",
        name: "Sensores electrónicos",
        slug: "sensores-electronicos",
      },
      { id: "el3", name: "Actuadores", slug: "actuadores" },
    ],
  },
  {
    id: 12,
    name: "Refrigeración",
    slug: "refrigeracion",
    icon: Thermometer,
    subcategories: [
      { id: "r1", name: "Radiador", slug: "radiador" },
      { id: "r2", name: "Ventilador", slug: "ventilador" },
      { id: "r3", name: "Termostato", slug: "termostato" },
    ],
  },
  {
    id: 13,
    name: "Climatización",
    slug: "climatizacion",
    icon: Wind,
    subcategories: [
      { id: "cl1", name: "Aire acondicionado", slug: "aire-acondicionado" },
      { id: "cl2", name: "Calefacción", slug: "calefaccion" },
      {
        id: "cl3",
        name: "Filtros de climatización",
        slug: "filtros-de-climatizacion",
      },
    ],
  },
];
