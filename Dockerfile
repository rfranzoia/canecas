FROM node:16.14-alpine3.15
MAINTAINER Romeu Franzoia Jr <romeufranzoia@me.com>

WORKDIR /app

COPY . .

RUN npm install -g npm@8.5.5
RUN npm install --only=production
RUN npm install typescript -g

USER node

CMD ["npm", "start"]

EXPOSE 3000