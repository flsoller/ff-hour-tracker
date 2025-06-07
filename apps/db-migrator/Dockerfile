# build / dev stage
FROM node:22.11-alpine AS builder
RUN corepack enable
WORKDIR /app

# COPY RELEVANT PACKAGE JSON ONLY TO MAXIMIZE CACHING
COPY package.json .
COPY yarn.lock .
COPY .yarnrc.yml .
COPY .yarn/releases .yarn/releases/
COPY turbo.json ./
COPY apps/db-migrator/package.json ./apps/db-migrator/package.json
COPY packages/db/package.json ./packages/db/package.json
COPY packages/tsconfig/package.json ./packages/tsconfig/package.json

RUN yarn install

# COPY RELEVANT PACKAGES CODE
COPY apps/db-migrator ./apps/db-migrator
COPY packages/db ./packages/db
COPY packages/tsconfig ./packages/tsconfig

# BUILD
RUN yarn turbo:build-ci

# INSTALL PRODUCTION DEPENDENCIES
RUN yarn workspaces focus @hour-tracker/db-migrator --production
RUN cp -RL node_modules /tmp/node_modules/

#########################
###### PROD STAGE #######
#########################
FROM node:22.11-alpine
RUN corepack enable
WORKDIR /app

COPY --from=builder /app/yarn.lock .
COPY --from=builder /app/.yarnrc.yml .
COPY --from=builder /app/.yarn/releases .yarn/releases/
COPY --from=builder /app/package.json .
COPY --from=builder /app/apps/db-migrator/dist ./apps/db-migrator/dist/
COPY --from=builder /app/apps/db-migrator/package.json ./apps/db-migrator/
COPY --from=builder /app/apps/db-migrator/src/migrations ./apps/db-migrator/dist/migrations/
COPY --from=builder /tmp/node_modules/ ./node_modules/

EXPOSE 5420

ENTRYPOINT ["tail", "-f", "/dev/null"]