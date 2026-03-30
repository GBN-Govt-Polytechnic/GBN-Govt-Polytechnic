# syntax=docker/dockerfile:1

FROM oven/bun:1 AS deps
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM oven/bun:1 AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json bun.lock tsconfig.json prisma.config.ts ./
COPY prisma ./prisma
COPY src ./src

RUN bunx prisma generate
RUN bun run build

FROM oven/bun:1 AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/bun.lock ./bun.lock
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/dist ./dist

EXPOSE 4000

CMD ["sh", "-c", "until bun -e \"const s=new (require('net').Socket)();s.connect(5432,'postgres',()=>{s.destroy();process.exit(0)});s.on('error',()=>process.exit(1))\" 2>/dev/null; do echo 'Waiting for postgres...'; sleep 2; done && bunx prisma migrate deploy && bun dist/index.js"]
