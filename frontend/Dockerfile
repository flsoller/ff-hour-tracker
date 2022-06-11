FROM node:14.17.6-alpine
ARG BUILD_CONTEXT

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY core ./core
COPY ./$BUILD_CONTEXT/package.json $BUILD_CONTEXT/
COPY ./$BUILD_CONTEXT/yarn.lock $BUILD_CONTEXT/
RUN yarn install --immutable --immutable-cache --check-cache

COPY ./$BUILD_CONTEXT $BUILD_CONTEXT/
COPY ./core core/

EXPOSE 3000

CMD [ "yarn", "run", "frontend:run-dev" ]