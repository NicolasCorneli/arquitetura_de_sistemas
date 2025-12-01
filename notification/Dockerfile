FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

COPY . .

RUN if [ -f prisma/schema.prisma ]; then npx prisma generate || true; fi

EXPOSE 3005

CMD ["node", "src/server.js"]
