FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port (Railway will override with $PORT)
EXPOSE 8000

# Run the application (use PORT env var from Railway)
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
