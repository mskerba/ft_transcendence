FROM node:19

WORKDIR /app

COPY package*.json ./

RUN npm install @nestjs/passport passport passport-google-oauth20

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:dev" ]