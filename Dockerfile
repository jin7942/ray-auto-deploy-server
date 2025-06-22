# --- Builder Stage ---
FROM node:22-alpine AS builder

WORKDIR /app

# 캐시 최적화를 위한 순서
COPY package*.json . 
RUN npm install

COPY . .
RUN npm run build


# --- Runtime Stage ---
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json .

RUN apk add --no-cache git docker-cli curl

# docker compose v2 설치
RUN mkdir -p /usr/local/lib/docker/cli-plugins && \
    curl -SL https://github.com/docker/compose/releases/download/v2.27.0/docker-compose-linux-x86_64 -o /usr/local/lib/docker/cli-plugins/docker-compose && \
    chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

RUN npm install --omit=dev

EXPOSE 7979
CMD ["node", "dist/server.js"]
