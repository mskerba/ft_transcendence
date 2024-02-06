FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install vite react react-dom react-router-dom axios react-modal react-toastify

# RUN npm install @mui/material @emotion/react @emotion/styled

RUN npm install @mui/icons-material

RUN npm i --save-dev @types/p5

RUN npm install socket.io-client react-modal react-spring


COPY . .


CMD ["npm", "run", "dev"]