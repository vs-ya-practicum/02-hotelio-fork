FROM node:20

WORKDIR /app

COPY package.json package-lock.json ./
COPY booking-subgraph/package.json ./booking-subgraph/
RUN npm install

COPY . .
RUN npm run build --workspace booking-subgraph

CMD ["node", "booking-subgraph/.delivery/.builds/dist/src/index.js"]
