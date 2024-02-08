FROM alpine:latest as build

WORKDIR /home/app

COPY package*.json ./
COPY tsconfig*.json ./

RUN apk add --no-cache npm && \
    npm ci && \
    npm cache clean --force

COPY ./src ./src

RUN npm run build && \
    npm ci --omit=dev && \
    npm cache clean --force

RUN npm install pkg --save-dev

RUN npx pkg dist/main.js --config package.json  --output app_pkg --target latest-alpine-arm64 --compress GZip

FROM alpine:latest as production

WORKDIR /home/app

COPY --from=build /home/app/app_pkg ./

RUN chmod +x app_pkg

EXPOSE 3000

ENTRYPOINT [ "./app_pkg" ]