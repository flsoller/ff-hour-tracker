FROM node:14.17.6-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY prisma ./

RUN npx prisma generate

COPY . .

EXPOSE 5000

CMD [ "npm", "run", "dev" ]