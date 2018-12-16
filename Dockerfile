FROM node:10.14-alpine

RUN mkdir -p /home/node/app
WORKDIR /home/node/app
COPY . /home/node/app

RUN npm install 
RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]
