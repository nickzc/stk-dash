FROM node:18-alpine as build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build:dev

EXPOSE 3000

CMD ["node", "dist/main.js"]