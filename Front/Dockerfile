# Etapa de compilación: instala las dependencias y genera los archivos estáticos.
FROM node:22-alpine AS build

WORKDIR /app

# Copiamos primero los manifiestos para reutilizar la caché de dependencias.
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Copiamos el código fuente y construimos la aplicación Vite.
COPY . .

RUN npm run build

# Etapa final: Nginx sirve únicamente los archivos estáticos generados.
FROM nginxinc/nginx-unprivileged@sha256:e1754f434ace974cdf9b9f98d868082b86ab8ee703f8466e6d3d777f553d3fb9 AS runtime

# Reemplazamos la configuración por la que incluye el fallback SPA y el proxy API.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos el resultado de la compilación a la carpeta pública de Nginx.
COPY --from=build --chown=root:root /app/dist /usr/share/nginx/html

# Documenta el puerto HTTP utilizado por Nginx dentro del contenedor.
EXPOSE 8080

# Mantiene Nginx en primer plano para que Docker supervise el proceso.
CMD ["nginx", "-g", "daemon off;"]
