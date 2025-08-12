#!/bin/sh
# Mensaje informativo: Muestra en consola que el contenedor está iniciando.

echo "🚀 Iniciando aplicación..."

# Espera de 10 segundos: Da tiempo a que el contenedor de PostgreSQL esté listo antes de continuar. 
# Es útil en Docker Compose para evitar que el backend intente conectarse antes de que la base 
# de datos esté disponible.

echo "⏳ Esperando 10 segundos para PostgreSQL..."
sleep 10

# Aplica el esquema de Prisma: Ejecuta prisma db push (a través del script prisma:push) 
# para asegurar que la base de datos tenga la estructura correcta. Si falla, 
# muestra una advertencia pero no detiene el contenedor.

echo "📝 Aplicando esquema de base de datos..."
npm run prisma:push --silent || echo "⚠️ Esquema no aplicado"

# Genera el cliente Prisma: Asegura que el código de acceso a la base de datos esté actualizado. 
# Si falla, muestra una advertencia.

echo "🔧 Generando cliente Prisma..."
npm run prisma:generate --silent || echo "⚠️ Cliente no generado"

# Carga datos de ejemplo: Ejecuta el script de seed para poblar 
# la base de datos con datos iniciales. Si falla, muestra una advertencia.

echo "🌱 Ejecutando seed..."
node src/prisma/seed.js || echo "⚠️ Seed omitido"

# Inicia el servidor: Lanza la aplicación Node.js en modo producción.

echo "🎬 Iniciando servidor..."
exec npm start