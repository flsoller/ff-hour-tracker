FROM public.ecr.aws/lambda/nodejs:20.2024.07.10.10-arm64 as builder
RUN corepack enable

WORKDIR /usr/app

COPY package.json ./
COPY yarn.lock ./
COPY .yarnrc.yml ./
COPY .yarn/releases .yarn/releases/
COPY ./aws_api/authorizer/package.json aws_api/authorizer/

RUN yarn install

COPY ./aws_api/authorizer aws_api/authorizer/

RUN yarn authorizer:build

FROM public.ecr.aws/lambda/nodejs:20.2024.07.10.10-arm64
WORKDIR ${LAMBDA_TASK_ROOT}
COPY --from=builder /usr/app/aws_api/authorizer/dist/* ./
CMD ["index.handler"]