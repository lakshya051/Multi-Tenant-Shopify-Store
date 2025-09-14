# Use Node.js 18 LTS with Debian base (better for native modules)
FROM node:18-slim

# Install build dependencies for native modules
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (without running postinstall scripts)
RUN npm ci --only=production --ignore-scripts

# Copy source code
COPY . .

# Rebuild bcrypt for the current platform
RUN npm rebuild bcrypt

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Start the application with migrations
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
