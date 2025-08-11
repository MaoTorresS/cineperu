# 🎬 CinePerú Frontend

Este es el frontend de **CinePerú**, hecho en React + Vite + Tailwind CSS.

## 🚀 Cómo iniciar el frontend

### 1. Entrar al frontend
```bash
cd cineperu/cineperu-frontend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar el proyecto
```bash
npm run dev
```

El frontend estará corriendo en:
```
http://localhost:5173
```

---

### 🚀 Despliegue y CI/CD

- El frontend se despliega automáticamente en [Vercel](https://vercel.com) al hacer push a `main`.
- Linting y type-checking automáticos en cada push.
- Validación de calidad antes de cada build.
- Contextos y hooks refactorizados para Fast Refresh y mejor DX.

👉 Puedes modificar las páginas en `src/pages/` y los estilos globales en `src/index.css`.