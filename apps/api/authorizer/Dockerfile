FROM public.ecr.aws/lambda/nodejs:20.2024.07.10.10-arm64 as builder
RUN corepack enable

WORKDIR /usr/app

COPY package.json ./
COPY yarn.lock ./
COPY .yarnrc.yml ./
COPY .yarn/releases .yarn/releases/
COPY turbo.json ./
COPY ./apps/api/authorizer/package.json apps/api/authorizer/

RUN yarn install

COPY ./apps/api/authorizer apps/api/authorizer/

RUN yarn turbo:build-ci

FROM public.ecr.aws/lambda/nodejs:20.2024.07.10.10-arm64
WORKDIR ${LAMBDA_TASK_ROOT}
COPY --from=builder /usr/app/apps/api/authorizer/dist/* ./
CMD ["index.handler"]