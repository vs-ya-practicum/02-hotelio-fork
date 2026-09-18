FROM node:20

WORKDIR /app

COPY package.json package-lock.json ./
COPY services/gateway/package.json ./services/gateway/
RUN npm install

COPY . .
RUN npm run build --workspace apollo-gateway

CMD ["node", "services/gateway/.delivery/.builds/dist/src/index.js"]
