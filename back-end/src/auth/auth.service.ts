import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    async signIn(user) {
        if (!user) {
            throw new BadRequestException("Unauthenticated");
        }

        const userExists = await this.usersService.findByEmail(user.email);
        if (!userExists) {
            return this.registerUser(user);
        }

        const tokens = await this.generateTokens(userExists.user_id, userExists.email);
        await this.updateRtHash(userExists.user_id, tokens.refresh_token);
        return tokens;
    }

    async registerUser(user: CreateUserDto) {
        const newUser = await this.usersService.create(user);

        const tokens = await this.generateTokens(newUser.user_id, newUser.email);
        await this.updateRtHash(newUser.user_id, tokens.refresh_token);
        return tokens;
    }

    async updateRtHash(userId: number, rt: string) {
        const hash = await this.hashData(rt);

        await this.usersService.update(userId, {hashed_rt: hash});
    }

    async logout(userId: number) {
        await this.prisma.users.updateMany({
            where: {
                user_id: userId,
                hashed_rt: {
                    not: null,
                },
            },
            data: {
                hashed_rt: null,
            }
        });
    }

    async refreshTokens(userId: number, rt: string) {
        const user = await this.usersService.findOne(userId);
        if (!user || !user.hashed_rt) throw new ForbiddenException('Access Denied!');

        const rtMatches = await bcrypt.compare(rt, user.hashed_rt);
        if (!rtMatches) throw new ForbiddenException('Access Denied!');

        const tokens = await this.generateTokens(user.user_id, user.email);
        await this.updateRtHash(user.user_id, tokens.refresh_token);
        return tokens;
    }

    async generateTokens(userId: number, email: string) {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email: email,
                },
                {
                    secret: 'at-secret',
                    expiresIn: 60 * 15,
                }
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email: email,
                },
                {
                    secret: 'rt-secret',
                    expiresIn: 60 * 60 * 24 * 7,
                }
            ),
        ]);

        return {
            access_token: at,
            refresh_token: rt,
        };
    }

    hashData(data: string) {
        return bcrypt.hash(data, 10);
    }



}
