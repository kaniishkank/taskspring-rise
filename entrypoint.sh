#!/bin/sh

echo "Starting frontend server..."
# Start the frontend server (Nitro) in the background on port 3000
PORT=3000 node /app/frontend/server/index.mjs &

echo "Running database migrations / schema sync..."
# Run Prisma db push to sync schema with database before launching the backend
cd /app/backend
npx prisma db push

echo "Starting backend server..."
# Start the backend server in the background on port 4000
PORT=4000 node dist/server.js &

echo "Starting Nginx reverse proxy..."
# Start Nginx in the background
nginx -g "daemon off;" &

# Start ngrok tunnel if NGROK_AUTHTOKEN is provided
if [ -n "$NGROK_AUTHTOKEN" ]; then
  echo "Starting ngrok tunnel on port 80..."
  ngrok config add-authtoken "$NGROK_AUTHTOKEN"
  # Start ngrok and log its output to a file
  ngrok http 80 --log=stdout > /tmp/ngrok.log 2>&1 &
  # Wait up to 15 seconds for the tunnel URL to appear
  for i in $(seq 1 15); do
    sleep 1
    NGROK_URL=$(grep -o 'url=https://[^ ]*' /tmp/ngrok.log 2>/dev/null | head -1 | cut -d= -f2)
    if [ -n "$NGROK_URL" ]; then
      echo "==========================================="
      echo "  ngrok Public URL: $NGROK_URL"
      echo "==========================================="
      break
    fi
  done
  if [ -z "$NGROK_URL" ]; then
    echo "WARNING: Could not retrieve ngrok URL. Check /tmp/ngrok.log inside the container."
  fi
else
  echo "NGROK_AUTHTOKEN not set. Skipping ngrok tunnel."
fi

# Keep container running by waiting on all background jobs
wait
