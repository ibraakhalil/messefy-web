# Stage 1: Building the application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy all files
COPY . .

# Build the application
ENV NEXT_DISABLE_TYPESCRIPT_TYPES=1
RUN npm run build

# Stage 2: Running the application
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json* ./package-lock.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/public ./public

# Expose the port
EXPOSE 3000

# Set the command to run the application
CMD ["npm", "start"]
