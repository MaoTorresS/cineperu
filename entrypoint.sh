#!/bin/sh

echo "🏗️ Ejecutando migraciones Prisma..."
npx prisma db push

echo "🚀 Iniciando servidor Node.js..."
node dist/app.js
