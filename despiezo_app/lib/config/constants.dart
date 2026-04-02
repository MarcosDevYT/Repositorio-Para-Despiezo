import 'package:flutter/material.dart';

class AppCategory {
  final int id;
  final String name;
  final String slug;
  final IconData icon;
  final List<AppSubcategory> subcategories;

  const AppCategory({
    required this.id,
    required this.name,
    required this.slug,
    required this.icon,
    required this.subcategories,
  });
}

class AppSubcategory {
  final String id;
  final String name;
  final String slug;

  const AppSubcategory({required this.id, required this.name, required this.slug});
}

final List<AppCategory> appCategories = [
  AppCategory(id: 1, name: 'Carrocería', slug: 'carroceria', icon: Icons.directions_car, subcategories: [
    AppSubcategory(id: 'c1', name: 'Parachoques delantero', slug: 'parachoques-delantero'),
    AppSubcategory(id: 'c2', name: 'Parachoques trasero', slug: 'parachoques-trasero'),
    AppSubcategory(id: 'c3', name: 'Aletas', slug: 'aletas'),
    AppSubcategory(id: 'c4', name: 'Puertas', slug: 'puertas'),
    AppSubcategory(id: 'c5', name: 'Capó', slug: 'capo'),
    AppSubcategory(id: 'c6', name: 'Maletero', slug: 'maletero'),
    AppSubcategory(id: 'c7', name: 'Retrovisores', slug: 'retrovisores'),
    AppSubcategory(id: 'c8', name: 'Cristales', slug: 'cristales'),
  ]),
  AppCategory(id: 2, name: 'Motor', slug: 'motor', icon: Icons.speed, subcategories: [
    AppSubcategory(id: 'm1', name: 'Bloque de motor', slug: 'bloque-de-motor'),
    AppSubcategory(id: 'm2', name: 'Culata', slug: 'culata'),
    AppSubcategory(id: 'm3', name: 'Pistones', slug: 'pistones'),
    AppSubcategory(id: 'm4', name: 'Válvulas', slug: 'valvulas'),
    AppSubcategory(id: 'm5', name: 'Cigüeñal', slug: 'ciguenal'),
    AppSubcategory(id: 'm6', name: 'Correa / Cadena de distribución', slug: 'correa-cadena-de-distribucion'),
    AppSubcategory(id: 'm7', name: 'Inyectores', slug: 'inyectores'),
    AppSubcategory(id: 'm8', name: 'Bomba de combustible', slug: 'bomba-de-combustible'),
  ]),
  AppCategory(id: 3, name: 'Frenos', slug: 'frenos', icon: Icons.album_outlined, subcategories: [
    AppSubcategory(id: 'f1', name: 'Discos', slug: 'discos'),
    AppSubcategory(id: 'f2', name: 'Pastillas', slug: 'pastillas'),
    AppSubcategory(id: 'f3', name: 'Calipers', slug: 'calipers'),
    AppSubcategory(id: 'f4', name: 'Bombín / cilindro maestro', slug: 'bomin-cilindro-maestro'),
    AppSubcategory(id: 'f5', name: 'ABS', slug: 'abs'),
  ]),
  AppCategory(id: 4, name: 'Suspensión', slug: 'suspension', icon: Icons.settings, subcategories: [
    AppSubcategory(id: 's1', name: 'Amortiguadores', slug: 'amortiguadores'),
    AppSubcategory(id: 's2', name: 'Resortes', slug: 'resortes'),
    AppSubcategory(id: 's3', name: 'Bujes', slug: 'bujes'),
    AppSubcategory(id: 's4', name: 'Brazos de suspensión', slug: 'brazos-de-suspension'),
    AppSubcategory(id: 's5', name: 'Barra estabilizadora', slug: 'barra-estabilizadora'),
  ]),
  AppCategory(id: 5, name: 'Sistema Eléctrico', slug: 'sistema-electrico', icon: Icons.bolt, subcategories: [
    AppSubcategory(id: 'e1', name: 'Alternadores', slug: 'alternadores'),
    AppSubcategory(id: 'e2', name: 'Motores de arranque', slug: 'motores-de-arranque'),
    AppSubcategory(id: 'e3', name: 'Baterías', slug: 'baterias'),
    AppSubcategory(id: 'e4', name: 'Sensores', slug: 'sensores'),
    AppSubcategory(id: 'e5', name: 'Fusibles y relés', slug: 'fusibles-y-reles'),
    AppSubcategory(id: 'e6', name: 'ECU', slug: 'ecu'),
    AppSubcategory(id: 'e7', name: 'Luces y faros', slug: 'luces-faros'),
  ]),
  AppCategory(id: 6, name: 'Filtros', slug: 'filtros', icon: Icons.filter_alt_outlined, subcategories: [
    AppSubcategory(id: 'fi1', name: 'Filtro de aire', slug: 'filtro-de-aire'),
    AppSubcategory(id: 'fi2', name: 'Filtro de aceite', slug: 'filtro-de-aceite'),
    AppSubcategory(id: 'fi3', name: 'Filtro de combustible', slug: 'filtro-de-combustible'),
    AppSubcategory(id: 'fi4', name: 'Filtro de cabina', slug: 'filtro-de-cabina'),
  ]),
  AppCategory(id: 7, name: 'Transmisión', slug: 'transmision', icon: Icons.settings_applications, subcategories: [
    AppSubcategory(id: 't1', name: 'Caja de cambios', slug: 'caja-de-cambios'),
    AppSubcategory(id: 't2', name: 'Embrague', slug: 'embrague'),
    AppSubcategory(id: 't3', name: 'Cardanes y ejes', slug: 'cardanes-y-ejes'),
  ]),
  AppCategory(id: 8, name: 'Refrigeración', slug: 'refrigeracion', icon: Icons.thermostat, subcategories: [
    AppSubcategory(id: 'r1', name: 'Radiador', slug: 'radiador'),
    AppSubcategory(id: 'r2', name: 'Ventilador', slug: 'ventilador'),
    AppSubcategory(id: 'r3', name: 'Termostato', slug: 'termostato'),
    AppSubcategory(id: 'r4', name: 'Bomba de agua', slug: 'bomba-de-agua'),
  ]),
  AppCategory(id: 9, name: 'Climatización', slug: 'climatizacion', icon: Icons.air, subcategories: [
    AppSubcategory(id: 'cl1', name: 'Aire acondicionado', slug: 'aire-acondicionado'),
    AppSubcategory(id: 'cl2', name: 'Calefacción', slug: 'calefaccion'),
    AppSubcategory(id: 'cl3', name: 'Filtros de climatización', slug: 'filtros-de-climatizacion'),
  ]),
];

const List<Map<String, String>> conditionOptions = [
  {'value': 'nuevo', 'label': 'Nuevo', 'description': 'Nunca usado'},
  {'value': 'como-nuevo', 'label': 'Como nuevo', 'description': 'Perfectas condiciones'},
  {'value': 'buen-estado', 'label': 'En buen estado', 'description': 'Usado pero bien conservado'},
  {'value': 'condiciones-aceptables', 'label': 'En condiciones aceptables', 'description': 'Con signos de desgaste'},
  {'value': 'lo-ha-dado-todo', 'label': 'Lo ha dado todo', 'description': 'Puede necesitar reparación'},
];

String getConditionLabel(String value) {
  final match = conditionOptions.firstWhere(
    (c) => c['value'] == value,
    orElse: () => {'label': value},
  );
  return match['label'] ?? value;
}

Color getConditionColor(String condition) {
  switch (condition) {
    case 'nuevo':
      return const Color(0xFF22C55E);
    case 'como-nuevo':
      return const Color(0xFF3B82F6);
    case 'buen-estado':
      return const Color(0xFFF59E0B);
    case 'condiciones-aceptables':
      return const Color(0xFFF97316);
    case 'lo-ha-dado-todo':
      return const Color(0xFFEF4444);
    default:
      return const Color(0xFF64748B);
  }
}
