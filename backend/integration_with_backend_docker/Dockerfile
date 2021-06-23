FROM node:16-alpine

WORKDIR /code

ADD ./package.json /code/
RUN npm install
ADD . .

EXPOSE 3000

CMD [ "npm", "run", "dev" ]