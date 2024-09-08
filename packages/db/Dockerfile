# build / dev stage
FROM node:20.12.2-alpine AS build
WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY .yarnrc.yml .
COPY .yarn/releases .yarn/releases/
COPY turbo.json ./
COPY packages/db/package.json ./packages/db/package.json

RUN yarn install

COPY packages/db ./packages/db

RUN yarn turbo:build

COPY packages/db/src/migrations ./packages/db/dist/migrations/

EXPOSE 5420

ENTRYPOINT ["tail", "-f", "/dev/null"]