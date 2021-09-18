FROM node:14.17.6-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 4200

CMD [ "npm", "start" ]

