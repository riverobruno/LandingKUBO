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

# Creamos una identidad propia para ejecutar Nginx sin root.
USER root
RUN addgroup -S appgroup \
    && adduser -S -D -H -G appgroup appuser \
    && chown -R appuser:appgroup /etc/nginx/conf.d /var/cache/nginx

# Guardamos el template para que la imagen base lo renderice al iniciar el contenedor.
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Permite arrancar sin Compose y limita envsubst al upstream del backend.
ENV BACKEND_UPSTREAM=http://127.0.0.1:3000 \
    NGINX_ENVSUBST_FILTER=BACKEND_UPSTREAM

# Copiamos el resultado de la compilación a la carpeta pública de Nginx.
COPY --from=build --chown=root:root /app/dist /usr/share/nginx/html

# Documenta el puerto HTTP utilizado por Nginx dentro del contenedor.
EXPOSE 8080

# Ejecuta Nginx con el usuario no privilegiado creado para esta imagen.
USER appuser

# Mantiene Nginx en primer plano para que Docker supervise el proceso.
CMD ["nginx", "-g", "daemon off;"]
