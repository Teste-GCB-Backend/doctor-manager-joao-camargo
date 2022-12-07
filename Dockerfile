FROM node:16.15

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN yarn install --legacy-peer-deps --frozen-lockfile --network-timeout 100000

COPY . /usr/src/app

EXPOSE 3000
CMD [ "npm", "start" ]