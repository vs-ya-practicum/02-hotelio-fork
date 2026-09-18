FROM node:20

WORKDIR /app

COPY package.json package-lock.json ./
COPY services/booking-subgraph/package.json ./services/booking-subgraph/
RUN npm install

COPY . .
RUN npm run build --workspace booking-subgraph

CMD ["node", "services/booking-subgraph/.delivery/.builds/dist/src/index.js"]
