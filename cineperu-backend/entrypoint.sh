#!/bin/sh

echo "🚀 Iniciando aplicación..."

# Espera fija
echo "⏳ Esperando 10 segundos para PostgreSQL..."
sleep 10

# Aplicar esquema con reintentos
echo "📝 Aplicando esquema de base de datos..."
npm run prisma:push --silent || echo "⚠️ Esquema no aplicado"

# Generar cliente
echo "🔧 Generando cliente Prisma..."
npm run prisma:generate --silent || echo "⚠️ Cliente no generado"

# Seed usando archivo JavaScript
echo "🌱 Ejecutando seed..."
node src/prisma/seed.js || echo "⚠️ Seed omitido"

echo "🎬 Iniciando servidor..."
exec npm start