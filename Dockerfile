FROM node:22-alpine

WORKDIR /app

COPY package*.json nest-cli.json ./

RUN yarn install --production=false

EXPOSE 3000

CMD ["yarn", "start:dev"]