import { SaveUserService } from './save-user.service';
export declare class SaveUserController {
    private readonly saveUserService;
    constructor(saveUserService: SaveUserService);
    saveUser(body: any): Promise<any>;
    findUser(username: string): Promise<number>;
}
