FROM node:13

RUN mkdir -p /home/app

RUN chown node /home/app

USER node

WORKDIR /home/app

COPY --chown=node:node . .

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]