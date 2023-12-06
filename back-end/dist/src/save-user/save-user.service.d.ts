import { PrismaService } from '../prisma/prisma.service';
export declare class SaveUserService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    saveUser(username: string): Promise<any>;
    findUser(username: string): Promise<number>;
    addSock(username: string, socketId: string): Promise<void>;
}
