import {
  Heart,
  MessageCircleMore,
  Package,
  ShoppingBag,
  ShoppingCart,
  User,
  Disc3,
  Filter,
  Fuel,
  Gauge,
  Settings,
  Wrench,
  Zap,
  Cog,
  Cpu,
  Thermometer,
  Wind,
  Puzzle,
} from "lucide-react";
import { CarIcon, MotorIcon } from "./components/icons/Icons";

//   https://repositorio-para-despiezo.vercel.app/payment/subscriptions

export const conditions = [
  {
    value: "nuevo",
    label: "Nuevo",
    description: "Nunca usado",
  },
  {
    value: "como-nuevo",
    label: "Como nuevo",
    description: "Perfectas condiciones",
  },
  {
    value: "buen-estado",
    label: "En buen estado",
    description: "Usado pero bien conservado",
  },
  {
    value: "condiciones-aceptables",
    label: "En condiciones aceptables",
    description: "Con signos de desgaste",
  },
  {
    value: "lo-ha-dado-todo",
    label: "Lo ha dado todo",
    description: "Puede necesitar reparación",
  },
] as const;

/**
 * Planes para las subscripciones en stripe
 */
export const stripePlans = [
  {
    link:
      process.env.NODE_ENV === "development"
        ? "https://buy.stripe.com/test_cNi28t4GSdaX0hignL1Fe01"
        : "https://buy.stripe.com/test_fZu14p0qC3Ane88efD1Fe06",
    priceId:
      process.env.NODE_ENV === "development"
        ? "price_1SEHXaPVulflAmKdeTnhyEG2"
        : "price_1SF6AEPVulflAmKdiRL78XsA",
    price: 12,
    duration: "1 Mes",
  },
  {
    link:
      process.env.NODE_ENV === "development"
        ? "https://buy.stripe.com/test_5kQ7sN4GS1sf5BC4F31Fe02"
        : "https://buy.stripe.com/test_eVq4gB8X8b2P2pqb3r1Fe07",
    priceId:
      process.env.NODE_ENV === "development"
        ? "price_1SEHZMPVulflAmKdo2HRiK80"
        : "price_1SF6DbPVulflAmKdNalKduj1",
    price: 30,
    duration: "3 Mes",
  },
  {
    link:
      process.env.NODE_ENV === "development"
        ? "https://buy.stripe.com/test_14AeVfc9k5Iv4xyb3r1Fe05"
        : "https://buy.stripe.com/test_14A3cxb5g8UH5BCfjH1Fe08",
    priceId:
      process.env.NODE_ENV === "development"
        ? "price_1SF5WlPVulflAmKdgOZxa63z"
        : "price_1SF6EJPVulflAmKd5jgAr1cQ",
    price: 54,
    duration: "6 Mes",
  },
  {
    link:
      process.env.NODE_ENV === "development"
        ? "https://buy.stripe.com/test_bJe14p7T43AnaVWefD1Fe04"
        : "https://buy.stripe.com/test_9B68wRb5gef1aVW3AZ1Fe09",
    priceId:
      process.env.NODE_ENV === "development"
        ? "price_1SEHa6PVulflAmKdWcEp97WU"
        : "price_1SF6FbPVulflAmKdpxxD3mHN",
    price: 100,
    duration: "1 Año",
  },
];

/**
 * @description Array de links para el perfil del usuario
 * @info array para el componente ProfileLinks
 */
export const ProfileNavLinks = [
  {
    label: "Perfil",
    href: "/perfil",
    icon: <User />,
  },
  {
    label: "Mensajes",
    href: "/inbox",
    icon: <MessageCircleMore />,
  },
  {
    label: "Favoritos",
    href: "/perfil/favoritos",
    icon: <Heart />,
  },
  {
    label: "Mis Compras",
    href: "/perfil/compras",
    icon: <ShoppingBag />,
  },
  {
    label: "Mis Productos",
    href: "/vendedor",
    icon: <Package />,
  },
  {
    label: "Mis Ventas",
    href: "/vendedor/ventas",
    icon: <ShoppingCart />,
  },
  {
    label: "Configuracion",
    href: "/perfil/configuracion",
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
        href: "/perfil",
        icon: <User className="size-4" strokeWidth={2.5} />,
      },
      {
        label: "Mensajes",
        href: "/inbox",
        icon: <MessageCircleMore className="size-4" strokeWidth={2.5} />,
      },
      {
        label: "Favoritos",
        href: "/perfil/favoritos",
        icon: <Heart className="size-4" strokeWidth={2.5} />,
      },
      {
        label: "Mis Compras",
        href: "/perfil/compras",
        icon: <ShoppingBag className="size-4" strokeWidth={2.5} />,
      },
    ],
  },
  {
    title: "Vender",
    links: [
      {
        label: "Mis Productos",
        href: "/vendedor",
        icon: <Package className="size-4" strokeWidth={2.5} />,
      },
      {
        label: "Mis Ventas",
        href: "/vendedor/ventas",
        icon: <ShoppingCart className="size-4" strokeWidth={2.5} />,
      },
    ],
  },
  {
    title: "Configuracion",
    links: [
      {
        label: "Administrar Plan",
        href: "/payment/subscriptions",
        icon: <Zap className="size-4" strokeWidth={2.5} />,
      },
      {
        label: "Configuracion",
        href: "/perfil/configuracion",
        icon: <Settings className="size-4" strokeWidth={2.5} />,
      },
    ],
  },
];

export const categories = [
  {
    id: 1,
    name: "Carroceria",
    slug: "carroceria",
    isLocalIcon: true,
    icon: CarIcon,
    count: "2,450 productos",
    subcategories: [
      {
        id: "c1",
        name: "Parachoques delantero",
        slug: "parachoques-delantero",
      },
      { id: "c2", name: "Parachoques trasero", slug: "parachoques-trasero" },
      { id: "c3", name: "Aletas", slug: "aletas" },
      { id: "c4", name: "Puertas", slug: "puertas" },
      { id: "c5", name: "Capó", slug: "capo" },
      { id: "c6", name: "Maletero", slug: "maletero" },
      { id: "c7", name: "Retrovisores", slug: "retrovisores" },
      { id: "c8", name: "Cristales", slug: "cristales" },
    ],
  },
  {
    id: 2,
    name: "Motor",
    slug: "motor",
    isLocalIcon: true,
    icon: MotorIcon,
    count: "2,450 productos",
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
    count: "1,230 productos",
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
    count: "890 productos",
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
    count: "1,560 productos",
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
    count: "780 productos",
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
    count: "560 productos",
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
    count: "340 productos",
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
    count: "920 productos",
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
    count: "650 productos",
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
    count: "445 productos",
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
    count: "320 productos",
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
    count: "280 productos",
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
  {
    id: 14,
    name: "Accesorios y Repuestos",
    slug: "accesorios-repuestos",
    icon: Puzzle,
    count: "1,150 productos",
    subcategories: [
      { id: "ar1", name: "Neumáticos y llantas", slug: "neumaticos-llantas" },
      { id: "ar2", name: "Baterías", slug: "baterias" },
      { id: "ar3", name: "Luces y faros", slug: "luces-faros" },
      { id: "ar4", name: "Audio y multimedia", slug: "audio-multimedia" },
      {
        id: "ar5",
        name: "Accesorios interiores",
        slug: "accesorios-interiores",
      },
      {
        id: "ar6",
        name: "Accesorios exteriores",
        slug: "accesorios-exteriores",
      },
      { id: "ar7", name: "Repuestos mecánicos", slug: "repuestos-mecanicos" },
      { id: "ar8", name: "Seguridad y confort", slug: "seguridad-confort" },
    ],
  },
];
