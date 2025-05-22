# Stage 1: Build dependencies
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci --only=production

COPY ./src .

# Stage 2: 
FROM node:18-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app .

EXPOSE 3000

CMD ["node", "index.js"]