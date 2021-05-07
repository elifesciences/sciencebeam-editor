FROM node:fermium-alpine

WORKDIR /app

RUN apk update && apk add zip

COPY  ./package.json ./

RUN npm install

COPY src/ src/

CMD ["node", "./src/index.js"]

EXPOSE 8080