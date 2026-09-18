FROM node:20

WORKDIR /app

COPY package.json package-lock.json ./
COPY services/promocode-subgraph/package.json ./services/promocode-subgraph/
RUN npm install

COPY . .
RUN npm run build --workspace promocode-subgraph

CMD ["node", "services/promocode-subgraph/.delivery/.builds/dist/src/index.js"]
