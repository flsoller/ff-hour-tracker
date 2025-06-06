#########################
###### BUILD STAGE ######
#########################
FROM public.ecr.aws/newrelic-lambda-layers-for-docker/newrelic-lambda-layers-nodejs:22-arm64 AS layer
FROM public.ecr.aws/lambda/nodejs:22.2025.05.04.04-arm64 AS builder
RUN corepack enable

WORKDIR /usr/app

# COPY RELEVANT PACKAGE JSON ONLY TO MAXIMIZE CACHING
COPY package.json ./
COPY yarn.lock ./
COPY .yarnrc.yml ./
COPY .yarn/releases .yarn/releases/
COPY turbo.json ./
COPY ./apps/api/members/package.json apps/api/members/
COPY ./packages/lambda-api/package.json packages/lambda-api/
COPY ./packages/tsconfig/package.json packages/tsconfig/
COPY ./packages/db/package.json packages/db/

RUN yarn install

# COPY RELEVANT PACKAGES CODE
COPY ./apps/api/members apps/api/members/
COPY ./packages/lambda-api packages/lambda-api/
COPY ./packages/tsconfig packages/tsconfig/
COPY ./packages/db packages/db/

# BUILD
RUN yarn turbo:build-ci

# INSTALL PRODUCTION DEPENDENCIES
RUN yarn workspaces focus @hour-tracker/api-members --production
RUN cp -RL node_modules /tmp/node_modules/


#########################
###### PROD STAGE #######
#########################
FROM public.ecr.aws/lambda/nodejs:22.2025.05.04.04-arm64
COPY --from=layer /opt/ /opt/

WORKDIR ${LAMBDA_TASK_ROOT}
# COPY RELEVANT FILES
COPY --from=builder /usr/app/apps/api/members/dist/ ./apps/api/members/
COPY --from=builder /tmp/node_modules/ ./node_modules/

CMD ["/opt/nodejs/node_modules/newrelic-esm-lambda-wrapper/index.handler"]