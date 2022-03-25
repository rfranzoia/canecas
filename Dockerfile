FROM node:16.14-alpine3.15

WORKDIR /app

COPY . .

RUN npm install --only=production
RUN npm install typescript -g
RUN npm install pm2 -g

RUN tsc

USER node

CMD ["npm", "run", "cluster"]

EXPOSE 3000