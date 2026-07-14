# ==========================================
# STAGE 1: Build Backend
# ==========================================
FROM node:22-alpine AS backend-builder

RUN apk add --no-cache openssl

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci

COPY backend/prisma ./prisma
RUN npx prisma generate

COPY backend/tsconfig*.json ./
COPY backend/src ./src

RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev

# ==========================================
# STAGE 2: Build Frontend
# ==========================================
FROM node:22-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./

# Use npm install if package-lock.json is not synced.
# After fixing the lock file, change back to npm ci.
RUN npm install

COPY frontend ./

ENV NODE_ENV=production
ENV VITE_API_URL=/api
ENV NITRO_PRESET=node-server

RUN npm run build

# ==========================================
# STAGE 3: Runtime
# ==========================================
FROM node:22-alpine

RUN apk add --no-cache \
    nginx \
    curl \
    openssl \
    ca-certificates

# Install ngrok
RUN curl -sSL https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz \
    | tar -xz -C /usr/local/bin

# Configure nginx
COPY nginx.conf /etc/nginx/nginx.conf
RUN mkdir -p /run/nginx /var/log/nginx

# ==========================================
# Backend
# ==========================================
WORKDIR /app/backend

COPY --from=backend-builder /app/backend/package.json ./
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/prisma ./prisma

# ==========================================
# Frontend
# ==========================================
WORKDIR /app/frontend

COPY --from=frontend-builder /app/frontend/.output ./

# ==========================================
# Startup
# ==========================================
WORKDIR /app

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

ENV NODE_ENV=production

EXPOSE 80

ENTRYPOINT ["./entrypoint.sh"]