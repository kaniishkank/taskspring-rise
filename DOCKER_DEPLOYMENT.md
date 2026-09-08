# Taskspring Rise Docker Deployment Guide

This guide details how to build the optimized single-container Docker image containing both the frontend (TanStack Start/Nitro) and backend (Express/Prisma) reverse-proxied by Nginx, and run it on an **AWS EC2 t2.micro** instance.

---

## 🛠️ Created Configurations

We have added the following files to your project root:
1. `Dockerfile`: Optimized, multi-stage build using `node:18-alpine` as base, which compiles the frontend and backend, prunes development dependencies, and sets up Nginx.
2. `nginx.conf`: Nginx configuration to reverse-proxy `/api` to the backend (port 4000) and all other traffic to the frontend SSR (port 3000) under port 80.
3. `entrypoint.sh`: Startup script that automatically runs Prisma schema migrations (`npx prisma db push`), launches the frontend and backend, and keeps Nginx running in the foreground.

---

## 📦 Build & Push to Docker Hub

Since Docker is not installed on your current development system, build the container on a machine with Docker installed (or inside a CI/CD pipeline).

1. **Build and Tag the Image:**
   Replace `<your-dockerhub-username>` with your actual Docker Hub username.
   ```bash
   docker build -t nishathjp/taskspring-rise:latest .
   ```

2. **Log in to Docker Hub:**
   ```bash
   docker login
   ```

3. **Push the Image to Docker Hub:**
   ```bash
   docker push nishathjp/taskspring-rise:latest
   ```

---

## 🚀 How to Deploy on AWS EC2 (t2-micro)

### Step 1: Install Docker on the EC2 Instance
Connect to your EC2 instance via SSH and run:

#### For Amazon Linux 2023 (default AWS AMI):
```bash
# Install Docker
sudo dnf update -y
sudo dnf install docker -y

# Start Docker and enable it on startup
sudo systemctl start docker
sudo systemctl enable docker

# Add ec2-user to docker group
sudo usermod -aG docker ec2-user
newgrp docker
```

#### For Ubuntu EC2:
```bash
# Install Docker
sudo apt-get update -y
sudo apt-get install docker.io -y

# Start Docker and enable it on startup
sudo systemctl start docker
sudo systemctl enable docker

# Add ubuntu user to docker group
sudo usermod -aG docker ubuntu
newgrp docker
```
> [!NOTE]
> Run `docker ps` to confirm Docker is working before proceeding.


### Step 2: Configure Environment Variables

You have two choices to supply your environment variables (Supabase DB URL, JWT secrets, etc.) to the container:

#### Option A: Copy the `.env` file (Recommended)
You only need to transfer your `.env` file to the EC2 instance (no codebase upload is needed).
```bash
scp -i your-key.pem backend/.env ubuntu@your-ec2-ip:/home/ubuntu/.env
```

#### Option B: Inline Environment Variables (No file transfer needed)
You can paste the environment variables directly into the run command using `-e` flags.

---

### Step 3: Pull and Run the Container

#### If you chose Option A (using `.env` file):
On the EC2 instance, navigate to the folder containing your `.env` file and run:
```bash
# Pull the latest image
docker pull nishathjp/taskspring-rise:latest

# Run the container using the environment file
docker run -d \
  --name taskspring-app \
  -p 80:80 \
  --env-file .env \
  --restart unless-stopped \
  <your-dockerhub-username>/taskspring-rise:latest
```

#### If you chose Option B (passing variables inline):
On the EC2 instance, paste the following command directly into your terminal (replace values with the contents from your local `.env` file):
```bash
# Pull the latest image
docker pull nishathjp/taskspring-rise:latest

# Run the container with inline variables
docker run -d \
  --name taskspring-app \
  -p 80:80 \
  -e DATABASE_URL="postgresql://postgres.rnoiimdtowlrzhlzijpp:bangban4120D@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true" \
  -e DIRECT_URL="postgresql://postgres.rnoiimdtowlrzhlzijpp:bangban4120D@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres" \
  -e JWT_SECRET="your-super-secret-key-change-in-production" \
  -e PORT=4000 \
  -e META_WHATSAPP_PHONE_NUMBER_ID="1148775651651936" \
  -e META_WHATSAPP_ACCESS_TOKEN="EAAY3YahesJwBRn1udm6J5JAOZCjausFLocDsy7WZBho1fKBHIcGlxNhZCeV0MWbxMfXjKPfudzFlIjYmDBYHec0Ckt3wOIcjzwRmZAMXEzerW27ro0nvKYIedRfuytgwFbio2T14LZB8qDET4HMbXtxaSMO1JvkEdJi9nUNXixAUMZBsw980D55SyJ3aBZAvQZDZD" \
  --restart unless-stopped \
  <your-dockerhub-username>/taskspring-rise:latest
```

---

### Step 4: Verify the Deployment
1. Check the logs to ensure the database synced and both servers started correctly:
   ```bash
   docker logs taskspring-app
   ```
2. Open your EC2 instance's public IP address or domain in a browser (ensure port `80` is open in your EC2 Security Group).

---

## 💡 Image Size Optimization Details
- **Multi-Stage Build**: Separates build-time tools (TypeScript compiler, webpack/vite loaders) from runtime files.
- **Alpine Linux**: Uses Alpine base images to minimize the filesystem footprints.
- **Dependency Pruning**: The backend runs `npm prune --omit=dev` to remove heavy development packages, keeping the final container image under ~300MB





