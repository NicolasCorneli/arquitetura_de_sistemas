FROM node:18-bookworm-slim

# Dependências do Prisma no Debian bookworm
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl libssl3 ca-certificates \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
# Use ci em prod; se faltar package-lock.json, troca por npm install
RUN npm ci --only=production || npm install --production

COPY . .

# Gera o Prisma Client dentro da imagem
RUN npx prisma generate

EXPOSE 3001
CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]
