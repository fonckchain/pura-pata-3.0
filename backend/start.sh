#!/bin/bash

# Start script for Railway deployment
echo "Starting Pura Pata Backend..."

# Run database migrations (optional, if using alembic)
# alembic upgrade head

# Start uvicorn server
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
