# Etapa de construcción
FROM node:20-alpine AS builder
WORKDIR /app

# Instalar dependencias del sistema necesarias para algunas operaciones de seguridad y para Prisma
RUN apk add --no-cache openssl

# Copia archivos de dependencias y configuración de Prisma para instalar dependencias y preparar el cliente ORM.

COPY package*.json ./
COPY prisma ./prisma/

# Instala todas las dependencias (incluyendo las de desarrollo) de forma limpia y reproducible.

RUN npm ci && npm cache clean --force

# Genera el cliente Prisma para interactuar con la base de datos.

RUN npx prisma generate

# Copia todo el código fuente al contenedor.

COPY . .

# Compila la aplicación (transpila TypeScript a JavaScript listo para producción).

RUN npm run build

# Nueva imagen limpia: Solo para producción, más ligera y segura.
  
FROM node:20-alpine
WORKDIR /app

# Instala solo lo necesario: openssl y el cliente de PostgreSQL para migraciones o seeds.

RUN apk add --no-cache openssl postgresql-client

# Copia solo lo necesario desde la etapa de construcción: código compilado, dependencias, configuración y scripts.

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src

# Instala solo dependencias de producción (más seguro y liviano).
# Agrega herramientas necesarias para ejecutar scripts TypeScript en producción (como seeds o migraciones).

RUN npm ci --only=production && \
    npm install ts-node@^10.9.2 typescript@^5.8.3 @types/node && \
    npm cache clean --force

# Vuelve a generar el cliente Prisma (por si hay cambios en el entorno de producción).

RUN npx prisma generate

# Copia el script de entrada, corrige finales de línea (por compatibilidad Linux/Windows) y le da permisos de ejecución.

COPY entrypoint.sh ./
RUN sed -i 's/\r$//' entrypoint.sh && \
    chmod +x entrypoint.sh



# Crea y usa un usuario no root para ejecutar la app, mejorando la seguridad del contenedor.

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 && \
    chown -R nextjs:nodejs /app

USER nextjs

# Expone el puerto 3000 (donde corre tu backend).
# Define el script de entrada que inicia la aplicación.
EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]