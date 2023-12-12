FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install vite react react-dom react-router-dom axios

RUN npm i --save-dev @types/p5

COPY . .


# RUN npm run build


CMD ["npm", "run", "dev"]
