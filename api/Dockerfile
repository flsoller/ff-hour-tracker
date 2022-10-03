FROM node:16-alpine
ARG BUILD_CONTEXT

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY .yarnrc.yml .
COPY .yarn/releases .yarn/releases/

COPY core ./core
COPY ./$BUILD_CONTEXT/package.json $BUILD_CONTEXT/
RUN yarn install

COPY ./$BUILD_CONTEXT/prisma $BUILD_CONTEXT/

RUN yarn api:prisma-generate

COPY ./$BUILD_CONTEXT $BUILD_CONTEXT/
COPY ./core core/

EXPOSE 5000

CMD [ "yarn", "run", "api:run-dev" ]