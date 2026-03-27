const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando configuración del sistema de tracking OEM...\n');

// Paso 1: Leer el SQL de migración
const sqlPath = path.join(__dirname, 'prisma', 'migrations', 'add_oem_compatibility_tracker.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

console.log('📄 Migración SQL cargada');
console.log('📋 Contenido:');
console.log(sql);
console.log('\n');

// Paso 2: Ejecutar con Prisma
console.log('⚙️  Ejecutando migración...');
try {
  execSync('npx prisma db execute --file prisma/migrations/add_oem_compatibility_tracker.sql --schema prisma/schema.prisma', {
    stdio: 'inherit',
    cwd: __dirname
  });
  console.log('✅ Migración ejecutada exitosamente\n');
} catch (error) {
  console.error('❌ Error al ejecutar migración:', error.message);
  console.log('\n💡 Intenta ejecutar manualmente:');
  console.log('npx prisma db execute --file prisma/migrations/add_oem_compatibility_tracker.sql --schema prisma/schema.prisma\n');
  process.exit(1);
}

// Paso 3: Generar cliente de Prisma
console.log('🔧 Generando cliente de Prisma...');
try {
  execSync('npx prisma generate', {
    stdio: 'inherit',
    cwd: __dirname
  });
  console.log('✅ Cliente de Prisma generado exitosamente\n');
} catch (error) {
  console.error('❌ Error al generar cliente:', error.message);
  console.log('\n💡 Cierra el editor y ejecuta manualmente:');
  console.log('npx prisma generate\n');
  process.exit(1);
}

console.log('🎉 ¡Configuración completada!\n');
console.log('📝 Próximos pasos:');
console.log('1. Ejecuta: npm run dev');
console.log('2. Ve a: http://localhost:3000/tools/compatibilidad');
console.log('3. Ingresa la clave: catalogosecreto');
console.log('4. Haz clic en "Tracking Productos"');
console.log('5. Haz clic en "Sincronizar Productos"\n');
