FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production || npm install --production
COPY . .
RUN if [ -f prisma/schema.prisma ]; then npx prisma generate --schema=prisma/schema.prisma || true; fi
EXPOSE 3002
CMD [ "node", "src/server.js" ]
