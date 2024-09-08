#########################
###### BUILD STAGE ######
#########################
FROM public.ecr.aws/lambda/nodejs:20.2024.07.10.10-arm64 AS builder
RUN corepack enable

WORKDIR /usr/app

# COPY RELEVANT PACKAGE JSON ONLY TO MAXIMIZE CACHING
COPY package.json ./
COPY tsconfig.json ./
COPY yarn.lock ./
COPY .yarnrc.yml ./
COPY .yarn/releases .yarn/releases/
COPY turbo.json ./
COPY ./apps/api/authenticator/package.json apps/api/authenticator/
COPY ./packages/lambda-api/package.json packages/lambda-api/
COPY ./packages/tsconfig/package.json packages/tsconfig/
COPY ./packages/db/package.json packages/db/

RUN yarn install

# COPY RELEVANT PACKAGES CODE
COPY ./apps/api/authenticator apps/api/authenticator/
COPY ./packages packages/
COPY ./packages/db packages/db/

# BUILD
RUN yarn turbo:build

# INSTALL PRODUCTION DEPENDENCIES
RUN yarn workspaces focus @hour-tracker/api-authenticator --production
RUN cp -RL node_modules /tmp/node_modules/


#########################
###### PROD STAGE #######
#########################
FROM public.ecr.aws/lambda/nodejs:20.2024.07.10.10-arm64
WORKDIR ${LAMBDA_TASK_ROOT}

# COPY RELEVANT FILES
COPY --from=builder /usr/app/apps/api/authenticator/dist/ ./apps/api/authenticator/
COPY --from=builder /tmp/node_modules/ ./node_modules/

CMD ["apps/api/authenticator/index.handler"]