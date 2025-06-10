FROM oven/bun

WORKDIR /app

COPY . .

ENV NODE_ENV=production

# Install deps
RUN bun install

# Build frontend
RUN bunx vite build
RUN ls -l /app/build/frontend
RUN chmod -R 755 /app/build/frontend

# Ensure db file is created
RUN mkdir -p /app/data
RUN test ! -f /app/data/neollmchat.db && echo "" > /app/data/neollmchat.db || true

# Generate + push DB schema
RUN bunx drizzle-kit generate
RUN bunx drizzle-kit push

CMD ["bun", "server/index.ts"]

EXPOSE 8608
