FROM node:17-alpine

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

RUN npm run build

EXPOSE 3000

ENTRYPOINT yarn react-env

CMD yarn start