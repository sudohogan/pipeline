FROM node:latest

WORKDIR /app

COPY package*.json /app

RUN yarn install

COPY . ./app

EXPOSE 3003 

CMD [ "pnpm", "start" ]
