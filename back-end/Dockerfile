FROM node:19

RUN mkdir /myapp

WORKDIR /myapp

COPY package*.json ./


RUN npm install -g @nestjs/cli

RUN npm install -D prisma

RUN npm install @prisma/client @nestjs/mapped-types   class-validator class-transformer bcrypt unique-username-generator nodemailer

RUN npm install @nestjs/jwt @nestjs/passport passport passport-google-oauth20 passport-jwt passport-42 otplib qrcode @nestjs/platform-express cookie-parser @types/express

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:dev" ]

