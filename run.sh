#!/bin/bash
# Start the application with Docker Compose
docker compose up --build -d
echo "Waiting for containers to start..."
sleep 10
docker logs almedia-ingestion
