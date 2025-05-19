FROM node:22.14.0

# Folder for the project
RUN mkdir -p /opt/crypto-porfolio-app

COPY ./src /opt/crypto-porfolio-app/src
COPY ./package.json /opt/crypto-porfolio-app
COPY ./package-lock.json /opt/crypto-porfolio-app
COPY ./tsconfig.json /opt/crypto-porfolio-app
COPY ./.env /opt/crypto-porfolio-app

WORKDIR /opt/crypto-porfolio-app

# If changing make sure API_PORT is set on equal port
EXPOSE 3013

RUN npm i

# start service
CMD ["npm","start"]
