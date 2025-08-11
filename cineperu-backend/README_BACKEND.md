# 📦 CinePerú Backend

Este es el backend de **CinePerú**, una API construida con Node.js, Express, Prisma y PostgreSQL.

## 🚀 Cómo iniciar el backend

### 1. Clonar el repositorio y entrar al backend
```bash
git clone https://github.com/MaoTorresS/cineperu.git
cd cineperu/cineperu-backend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar el archivo .env
Crea un archivo `.env` con tu configuración:

```env
DATABASE_URL=postgresql://postgres:01deabril@localhost:5432/postgres
JWT_SECRET=supersecreto123
```

### 4. Migrar la base de datos
```bash
npx prisma migrate deploy
```

### 5. Generar cliente Prisma
```bash
npx prisma generate
```

### 6. Iniciar el servidor
```bash
npm run dev
```

## 🐳 Con Docker
Puedes levantar el backend y la base de datos con Docker Compose desde la carpeta raíz `cineperu`:
```bash
docker-compose up --build
```

---

## 🚀 Despliegue y CI/CD

- El backend se despliega automáticamente en [Render](https://render.com) usando un Deploy Hook.
- El deploy solo ocurre si los tests y el build pasan en GitHub Actions.
- La base de datos está en Railway, pero Railway **no** hace deploy del backend.
- Puedes ver el flujo en `.github/workflows/ci.yml`.

## 🧪 Calidad y pruebas

- Linting y type-checking automáticos en cada push.
- Tests automáticos antes de cada deploy.
- Arquitectura desacoplada y dockerizada.