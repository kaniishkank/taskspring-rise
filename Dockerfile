# ==========================================
# STAGE 1: Build the Backend
# ==========================================
FROM node:20-alpine AS backend-builder

RUN apk add --no-cache openssl

WORKDIR /app/backend

# Copy backend package manifests
COPY backend/package*.json ./

# Install all dependencies (needed for compilation)
RUN npm ci

# Copy schema and generate Prisma client
COPY backend/prisma ./prisma
RUN npx prisma generate

# Copy source and build TypeScript files
COPY backend/tsconfig*.json ./
COPY backend/src ./src
RUN npm run build

# Remove development dependencies to minimize image size
RUN npm prune --omit=dev

# ==========================================
# STAGE 2: Build the Frontend
# ==========================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package manifests
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend source files
COPY frontend ./

# Set environment variables for build
ENV VITE_API_URL=/api
ENV NITRO_PRESET=node-server

# Build the frontend using Nitro
RUN npm run build

# ==========================================
# STAGE 3: Final Runner Image
# ==========================================
FROM node:20-alpine

# Install Nginx and ngrok dependencies
RUN apk add --no-cache nginx openssl libc6-compat curl unzip

# Install ngrok
RUN curl -sSL https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz | tar -xz -C /usr/local/bin

# Set up Nginx runtime directories and configuration
COPY nginx.conf /etc/nginx/nginx.conf
RUN mkdir -p /run/nginx /var/log/nginx

# Copy Backend built files and production dependencies
WORKDIR /app/backend
COPY --from=backend-builder /app/backend/package.json ./
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/prisma ./prisma

# Copy Frontend built standalone output
WORKDIR /app/frontend
COPY --from=frontend-builder /app/frontend/.output ./

# Set up startup entrypoint
WORKDIR /app
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Expose Nginx port
EXPOSE 80

# Run entrypoint
ENTRYPOINT ["./entrypoint.sh"]
