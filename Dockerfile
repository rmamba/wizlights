FROM node:16-slim

WORKDIR /usr/src/app

COPY server.js .
COPY package.json .
RUN yarn install

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "node", "server.js" ] 
