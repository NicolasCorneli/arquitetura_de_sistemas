FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

COPY . .

# Caso algum dev deixe um schema, gera sem quebrar
RUN if [ -f prisma/schema.prisma ]; then npx prisma generate || true; fi

EXPOSE 3002

CMD ["node", "src/server.js"]
