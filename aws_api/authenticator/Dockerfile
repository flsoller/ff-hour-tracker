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
COPY ./aws_api/authenticator/package.json aws_api/authenticator/
COPY ./packages/lambda-api/package.json packages/lambda-api/
COPY ./packages/tsconfig/package.json packages/tsconfig/
COPY ./core/db/package.json core/db/

RUN yarn install

# COPY RELEVANT PACKAGES CODE
COPY ./aws_api/authenticator aws_api/authenticator/
COPY ./packages packages/
COPY ./core/db core/db/

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
COPY --from=builder /usr/app/aws_api/authenticator/dist/ ./aws_api/authenticator/
COPY --from=builder /tmp/node_modules/ ./node_modules/

CMD ["aws_api/authenticator/index.handler"]