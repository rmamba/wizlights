FROM node:18-slim as build

WORKDIR /usr/src/app
COPY . .
WORKDIR /usr/src/app/www
RUN yarn install
RUN yarn build

FROM node:18-slim

WORKDIR /usr/src/app

COPY server.js .
COPY package.json .
RUN yarn install

COPY --from=build /usr/src/app/www/build/ /usr/src/app/www/ 

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "node", "server.js" ] 
