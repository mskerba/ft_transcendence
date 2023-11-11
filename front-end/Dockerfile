FROM node:19

WORKDIR /app

COPY package*.json ./

RUN npm install @react-oauth/google@latest

COPY . .

RUN npm run build

CMD [ "npm", "start" ]