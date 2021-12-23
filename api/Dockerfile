FROM node:16-alpine

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
RUN yarn install

COPY prisma ./

RUN yarn prisma generate

COPY . .

EXPOSE 5000

CMD [ "yarn", "run", "dev" ]