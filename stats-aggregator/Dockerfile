FROM node:22-alpine

WORKDIR /app
COPY server.js ./server.js

ENV DOCKER_SOCKET=/var/run/docker.sock
EXPOSE 3000
CMD ["node", "server.js"]
