# Etapa de dependencias: instala también las dependencias de desarrollo
# necesarias para compilar TypeScript.
FROM node:22-alpine AS dependencies

WORKDIR /app

# Copiamos primero los manifiestos para aprovechar la caché de Docker
# mientras no cambien las dependencias.
COPY package.json package-lock.json ./
RUN npm ci

# Etapa de compilación: genera el JavaScript que ejecutará producción.
FROM node:22-alpine AS build

WORKDIR /app

# Reutilizamos las dependencias instaladas en la etapa anterior.
COPY --from=dependencies /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY . .
# Compilamos el backend TypeScript.
RUN npm run build

# Etapa separada para instalar únicamente dependencias de producción.
# Así la imagen final no incluye TypeScript ni otras herramientas de desarrollo.
FROM node:22-alpine AS production-dependencies

WORKDIR /app

COPY package.json package-lock.json ./
# Instalamos solo las dependencias necesarias durante la ejecución.
RUN npm ci --omit=dev

# Etapa final: contiene solamente el código compilado y sus dependencias runtime.
FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

# Copiamos los archivos con el propietario del usuario no-root de Node.
COPY --from=production-dependencies --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist

# Ejecutamos la aplicación sin privilegios de root.
USER node

# Documenta el puerto utilizado por la aplicación dentro del contenedor.
EXPOSE 3000

# Inicia el backend compilado.
CMD ["node", "dist/main.js"]
