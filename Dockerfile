# Etapa de construcción
FROM node:20-alpine AS builder
WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar todo el proyecto
COPY . .

# Generar el cliente Prisma
RUN npx prisma generate

# Construir el proyecto
RUN npm run build

# Etapa final
FROM node:20-alpine
WORKDIR /app

# Copiar archivos construidos
COPY --from=builder /app .

# Dar permisos al entrypoint
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

EXPOSE 3000
CMD ["./entrypoint.sh"]
