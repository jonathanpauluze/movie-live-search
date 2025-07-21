FROM node:20-alpine

WORKDIR /app

COPY . .

RUN corepack enable && \
    corepack prepare pnpm@8.15.6 --activate && \
    pnpm install

EXPOSE 5173

CMD ["pnpm", "dev"]
