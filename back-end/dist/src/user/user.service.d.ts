import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        userId: number;
        name: string;
        email: string;
        avatar: string;
        hashedRt: string;
        twoFA_Enabled: boolean;
        twoFA_Verified: boolean;
        twoFA_SecretKey: string;
        registrationDate: Date;
        sockId: string;
    }>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__UserClient<{
        userId: number;
        name: string;
        email: string;
        avatar: string;
        hashedRt: string;
        twoFA_Enabled: boolean;
        twoFA_Verified: boolean;
        twoFA_SecretKey: string;
        registrationDate: Date;
        sockId: string;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    findByEmail(email: string): import(".prisma/client").Prisma.Prisma__UserClient<{
        userId: number;
        name: string;
        email: string;
        avatar: string;
        hashedRt: string;
        twoFA_Enabled: boolean;
        twoFA_Verified: boolean;
        twoFA_SecretKey: string;
        registrationDate: Date;
        sockId: string;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: number, updateUserDto: UpdateUserDto): import(".prisma/client").Prisma.Prisma__UserClient<{
        userId: number;
        name: string;
        email: string;
        avatar: string;
        hashedRt: string;
        twoFA_Enabled: boolean;
        twoFA_Verified: boolean;
        twoFA_SecretKey: string;
        registrationDate: Date;
        sockId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__UserClient<{
        userId: number;
        name: string;
        email: string;
        avatar: string;
        hashedRt: string;
        twoFA_Enabled: boolean;
        twoFA_Verified: boolean;
        twoFA_SecretKey: string;
        registrationDate: Date;
        sockId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
