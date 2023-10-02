FROM node:16-alpine3.14 AS development

WORKDIR /usr/src/app

COPY package*.json yarn.lock entrypoint.sh ./

RUN npm install -g rimraf

RUN npm install  --only=development

COPY . .

RUN npm run build

RUN chmod 777 ./entrypoint.sh

FROM node:14-alpine3.14 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json yarn.lock entrypoint.sh ./

RUN npm install  --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

RUN chmod 777 ./entrypoint.sh

CMD ["node", "dist/main"]