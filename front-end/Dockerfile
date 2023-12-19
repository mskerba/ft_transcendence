FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install vite react react-dom react-router-dom axios react-modal qrcode.react


RUN npm i --save-dev @types/p5

RUN npm install socket.io-client

COPY . .


CMD ["npm", "run", "dev"]
