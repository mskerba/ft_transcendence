FROM node:19

WORKDIR /app

COPY package*.json ./

RUN npm install -g @nestjs/cli

RUN npm install -D prisma

RUN npm install dotenv @nestjs/mapped-types @nestjs/passport passport passport-google-oauth20

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:dev" ]