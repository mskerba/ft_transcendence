FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install vite react react-dom react-router-dom axios react-modal


RUN npm i --save-dev @types/p5

Run npm install socket.io-client
Run npm install react-modal

COPY . .


CMD ["npm", "run", "dev"]
