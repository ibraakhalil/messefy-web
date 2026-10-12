# Base image (lightweight Bun Alpine)
FROM oven/bun:1-alpine AS base
WORKDIR /app

# Dependencies
FROM base AS deps
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Final production image
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app

# Copy installed dependencies and source code
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Use non-root bun user
RUN chown -R bun:bun /app
USER bun

EXPOSE 5555

# Run the backend directly with Bun
CMD ["bun", "run", "index.ts"]
