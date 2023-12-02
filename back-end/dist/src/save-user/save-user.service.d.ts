import { PrismaService } from '../prisma/prisma.service';
export declare class SaveUserService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    saveUser(username: string): Promise<any>;
    addSock(username: string, socketId: string): Promise<void>;
}
