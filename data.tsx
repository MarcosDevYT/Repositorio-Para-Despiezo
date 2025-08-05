import {
  Heart,
  MessageCircleMore,
  Package,
  Settings,
  ShoppingBag,
  ShoppingCart,
  User,
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

/**
 * @description Array de productos de prueba
 * @info array para el componente ProductFilters
 */
export const productsArray = [
  {
    id: "1",
    image: "/brake-pads.jpg",
    images: ["/brake-pads.jpg", "/brake-pads.jpg", "/brake-pads.jpg"],
    title: "Pastillas de Freno Cerámicas Brembo - Honda Civic 2018-2022",
    price: 25000,
    originalPrice: 35000,
    rating: 4.8,
    reviewCount: 152,
    location: "CDMX, México",
    description:
      "Pastillas de freno de alto rendimiento, poco uso, excelente estado",
    condition: "verificado" as const,
    brand: "Brembo",
    model: "Civic",
    year: "2018-2022",
    isOffer: true,
    category: "Frenos",
    oemNumber: "06H-903-016",
  },
  {
    id: "2",
    image: "/air-filter.jpg",
    images: ["/air-filter.jpg", "/air-filter.jpg", "/air-filter.jpg"],
    title: "Filtro de Aire K&N Performance - Tsuru 2017-2020",
    price: 8500,
    rating: 4.5,
    reviewCount: 89,
    location: "Guadalajara, Jal",
    description: "Filtro de aire deportivo, mejora el rendimiento del motor",
    condition: "nuevo" as const,
    brand: "K&N",
    model: "Tsuru",
    year: "2017-2020",
    category: "Filtros",
    oemNumber: "06H-AD1-466",
  },
  {
    id: "3",
    image: "/alternator.jpg",
    images: ["/alternator.jpg", "/alternator.jpg", "/alternator.jpg"],
    title: "Alternador Bosch 120A - Nissan Sentra 2015-2019",
    price: 45000,
    rating: 4.7,
    reviewCount: 64,
    location: "Monterrey, NL",
    description: "Alternador remanufacturado con garantía de 6 meses",
    condition: "defectuoso" as const,
    brand: "Bosch",
    model: "Sentra",
    year: "2015-2019",
    category: "Sistema Eléctrico",
    oemNumber: "04465-02280",
  },
  {
    id: "4",
    image: "/brake-pads.jpg",
    images: ["/brake-pads.jpg", "/brake-pads.jpg", "/brake-pads.jpg"],
    title: "Discos de Freno Ventilados - Toyota Corolla 2016-2021",
    price: 18000,
    originalPrice: 25000,
    rating: 4.6,
    reviewCount: 201,
    location: "Puebla, Pue",
    description: "Par de discos delanteros, superficie lisa, sin deformaciones",
    condition: "usado" as const,
    brand: "Toyota",
    model: "Corolla",
    year: "2016-2021",
    isOffer: true,
    category: "Frenos",
    oemNumber: "33-2304",
  },
];
