# Etapa de construcción
FROM node:20-alpine AS builder
WORKDIR /app

# Instalar dependencias del sistema
RUN apk add --no-cache openssl

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar TODAS las dependencias
RUN npm ci && npm cache clean --force

# Generar cliente Prisma
RUN npx prisma generate

# Copiar código fuente
COPY . .

# Construir aplicación
RUN npm run build

# Etapa de producción
FROM node:20-alpine
WORKDIR /app

# Instalar dependencias del sistema
RUN apk add --no-cache openssl postgresql-client

# Copiar archivos construidos
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src

# Instalar dependencias de producción + herramientas necesarias
RUN npm ci --only=production && \
    npm install ts-node@^10.9.2 typescript@^5.8.3 @types/node && \
    npm cache clean --force

# Generar cliente Prisma
RUN npx prisma generate

# Copiar entrypoint
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

# Crear directorio para uploads
RUN mkdir -p uploads

# Usuario no root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 && \
    chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]