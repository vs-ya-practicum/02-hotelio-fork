FROM node:20

WORKDIR /app

COPY package.json package-lock.json ./
COPY services/hotel-subgraph/package.json ./services/hotel-subgraph/
RUN npm install

COPY . .
RUN npm run build --workspace hotel-subgraph

CMD ["node", "services/hotel-subgraph/.delivery/.builds/dist/src/index.js"]
