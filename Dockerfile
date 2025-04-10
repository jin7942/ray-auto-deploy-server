# 1단계: 빌드
FROM node:22-alpine AS builder

WORKDIR /app
COPY . .

RUN apk update && apk upgrade
RUN npm install
RUN npm run build

# 2단계: 실행
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json . 
COPY --from=builder /app/package-lock.json . 

RUN apk add --no-cache git

RUN npm install --omit=dev

EXPOSE 7979

CMD ["node", "dist/server.js"]
