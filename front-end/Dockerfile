FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install vite react react-dom react-router-dom axios react-modal react-toastify

RUN npm install @mui/material @emotion/react @emotion/styled

RUN npm install @mui/icons-material

RUN npm i --save-dev @types/p5 @types/react-modal

RUN npm install socket.io-client react-modal react-spring

RUN npm i --save-dev @types/react-modal

COPY . .


CMD ["npm", "run", "dev"]
