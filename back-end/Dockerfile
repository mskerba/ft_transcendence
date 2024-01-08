FROM node:19

WORKDIR /app

COPY package*.json ./

RUN npm install -g @nestjs/cli

RUN npm install -D prisma @types/express @types/multer

RUN npm install @prisma/client @nestjs/mapped-types   class-validator class-transformer bcrypt unique-username-generator nodemailer multer fs

RUN npm install @nestjs/jwt @nestjs/passport passport passport-google-oauth20 passport-jwt passport-42 otplib qrcode @nestjs/platform-express cookie-parser multer

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:dev" ]

