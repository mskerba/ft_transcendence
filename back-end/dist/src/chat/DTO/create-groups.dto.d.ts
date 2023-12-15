export declare class CreateGroupDto {
    UserId: number;
    TypeRoom: string;
    avatar?: string;
    title: string;
    password: string;
}
export declare class CreateRoleUserDto {
    userId: number;
    roomId: string;
    roleName: string;
}
export declare class PunishDto {
    roomId: string;
    senderId: number;
    userId: number;
}
export declare class MuteDto extends PunishDto {
    timeStart: Date;
    timeEnd: Date;
}
