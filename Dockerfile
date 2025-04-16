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
    
    RUN apk add --no-cache git
    RUN apk add --no-cache docker-cli
    RUN npm install --omit=dev
    
    EXPOSE 7979
    CMD ["node", "dist/server.js"]
    