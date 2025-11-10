FROM node:18-bookworm-slim

RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl libssl3 ca-certificates \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production || npm install --production
COPY . .
RUN npx prisma generate

EXPOSE 3004
CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]
