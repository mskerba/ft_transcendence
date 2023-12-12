export declare class CreateGroupDto {
    UserId: number;
    RoleName: 'owner' | 'admin' | 'member';
    TypeRoom: 'public' | 'protected' | 'private';
    avatar?: string;
    title: string;
    password?: string;
}
