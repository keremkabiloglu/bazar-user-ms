FROM alpine:latest as build

WORKDIR /home/app

RUN apk add --no-cache npm

COPY package*.json ./
COPY tsconfig*.json ./
COPY .env ./
RUN npm ci && npm cache clean --force
COPY ./src ./src

RUN npm run build

RUN npm ci --omit=dev && npm cache clean --force

FROM alpine:latest as production

WORKDIR /home/app

RUN apk add --no-cache nodejs

COPY --from=build /home/app/.env ./
COPY --from=build /home/app/dist ./dist
COPY --from=build /home/app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/main.js"]


