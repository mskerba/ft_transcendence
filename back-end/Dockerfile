FROM node:19

WORKDIR /app

COPY package*.json ./

RUN npm install -g @nestjs/cli

RUN npm install -D prisma

RUN npm install @prisma/client @nestjs/mapped-types   class-validator class-transformer speakeasy qrcode bcrypt

RUN npm install @nestjs/jwt @nestjs/passport passport passport-google-oauth20 passport-jwt passport-42

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:dev" ]
