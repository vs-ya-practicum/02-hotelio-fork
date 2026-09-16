FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY booking.proto ./
COPY src ./src

EXPOSE 9090

CMD ["npm", "run", "dev"]
