# Base image (latest Bun)
FROM oven/bun:latest AS base
WORKDIR /app

# Dependencies
FROM base AS deps
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Only run db:gen if it exists, remove build step
# RUN bun run db:gen

# Final production image
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app

# Copy everything needed (adjust based on your app structure)
COPY --from=builder /app/package.json .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

# Use non-root user
RUN chown -R bun:bun /app
USER bun

EXPOSE 5555
# Run the main file directly
CMD ["bun", "run", "index.ts"]
