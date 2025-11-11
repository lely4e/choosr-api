FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies (optional but good for common Python packages)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Tell Render what port the app runs on
ENV PORT=8000

# Expose that port (for local testing)
EXPOSE 8000

# Use Uvicorn to serve FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
