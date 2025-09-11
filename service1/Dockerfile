# syntax=docker/dockerfile:1

ARG NODE_VERSION=18.0.0

FROM node:${NODE_VERSION}-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

USER node

COPY . .

EXPOSE 8199

CMD ["node", "index.js"]