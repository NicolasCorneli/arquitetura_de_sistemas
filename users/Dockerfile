FROM node:18-bookworm-slim

# Dependências necessárias pelo prisma + segurança
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl libssl3 ca-certificates \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copia somente arquivos de dependências para cache eficiente
COPY package*.json ./

# Instala dependências na imagem
RUN npm install --production

# Copia o restante do projeto
COPY . .

# Gera o client do Prisma dentro da imagem
RUN npx prisma generate

EXPOSE 3004

CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]
