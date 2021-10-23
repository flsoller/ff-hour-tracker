FROM node:16-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY prisma ./

RUN npx prisma generate

COPY . .

EXPOSE 5000

CMD [ "npm", "run", "dev" ]