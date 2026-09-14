# Build the static SPA once; all replicas use the same image.
FROM node:22-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

# The runtime remains unprivileged. Its entrypoint only writes the runtime
# identity into the already-owned static document before starting Nginx.
FROM nginxinc/nginx-unprivileged@sha256:e1754f434ace974cdf9b9f98d868082b86ab8ee703f8466e6d3d777f553d3fb9 AS runtime

USER root
RUN addgroup -S appgroup \
    && adduser -S -D -H -G appgroup appuser \
    && mkdir -p /usr/share/nginx/html \
    && chown -R appuser:appgroup /etc/nginx/conf.d /var/cache/nginx /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build --chown=appuser:appgroup /app/dist /usr/share/nginx/html
COPY --chown=appuser:appgroup docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod 755 /usr/local/bin/docker-entrypoint.sh

ENV NODE_NAME=frontend

EXPOSE 8080
USER appuser
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
