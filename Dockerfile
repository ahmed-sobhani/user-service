FROM node:14-alpine3.14 AS development

WORKDIR /usr/src/app

COPY package*.json yarn.lock entrypoint.sh ./

RUN yarn add glob rimraf

RUN yarn install --pure-lockfile --only=development

COPY . .

RUN yarn build

RUN chmod 777 ./entrypoint.sh

FROM node:14-alpine3.14 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json yarn.lock entrypoint.sh ./

RUN yarn install --pure-lockfile --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

RUN chmod 777 ./entrypoint.sh

CMD ["node", "dist/main"]