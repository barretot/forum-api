FROM node:22.11

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN npm install -g pnpm && pnpm install

COPY . /app

CMD ["sh", "-c", "pnpm run build && pnpm start:dist"]