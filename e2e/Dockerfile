FROM node:16-alpine
FROM mcr.microsoft.com/playwright:v1.30.0-focal
ARG BUILD_CONTEXT

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY .yarnrc.yml .
COPY .yarn/releases .yarn/releases/

COPY ./$BUILD_CONTEXT/package.json $BUILD_CONTEXT/
RUN yarn install

# Install playwright dependencies
RUN npx playwright install --with-deps chromium

# copy project (including tests)
COPY ./$BUILD_CONTEXT $BUILD_CONTEXT/

ENTRYPOINT ["tail", "-f", "/dev/null"]