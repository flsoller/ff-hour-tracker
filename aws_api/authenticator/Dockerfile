FROM public.ecr.aws/lambda/nodejs:20.2024.05.29.09 as builder
RUN corepack enable

WORKDIR /usr/app

COPY package.json ./
COPY yarn.lock ./
COPY .yarnrc.yml ./
COPY .yarn/releases .yarn/releases/
COPY ./aws_api/authenticator/package.json aws_api/authenticator/

RUN yarn install

COPY ./aws_api/authenticator aws_api/authenticator/

RUN yarn authenticator:build

FROM public.ecr.aws/lambda/nodejs:20.2024.05.29.09
WORKDIR ${LAMBDA_TASK_ROOT}
COPY --from=builder /usr/app/aws_api/authenticator/dist/* ./
CMD ["index.handler"]