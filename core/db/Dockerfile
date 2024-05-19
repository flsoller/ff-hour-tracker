# build / dev stage
FROM node:20.12.2-alpine AS build
WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY .yarnrc.yml .
COPY .yarn/releases .yarn/releases/
COPY core/db/package.json ./core/db/package.json

RUN yarn install

COPY core/db ./core/db

RUN yarn core:db:build

COPY core/db/src/migrations ./core/db/dist/migrations/

EXPOSE 5420

ENTRYPOINT ["tail", "-f", "/dev/null"]