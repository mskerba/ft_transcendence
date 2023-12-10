import { PrismaService } from '../prisma/prisma.service';
export declare class ChatService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    findUserById(userid: number): Promise<any>;
    findUserByname(username: string): Promise<object>;
    findUserBySockid(socketId: string): Promise<{
        userId: number;
    }>;
    SockToClient(socketId: string, username: string): Promise<void>;
    findLinkMessage(user1: number, user2: number): Promise<any>;
    LinkDirectMessage(sender: number, receiver: number): Promise<any>;
    addDirectMessage(sender: number, receiver: number, msg: string): Promise<object>;
    FriendStatus(userId: number): Promise<{
        user1: {
            sockId: string;
        };
        user2: {
            sockId: string;
        };
    }[]>;
}
