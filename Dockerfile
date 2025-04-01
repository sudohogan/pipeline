FROM node:latest

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . ./app

EXPOSE 3005 

CMD [ "pnpm", "start" ]
