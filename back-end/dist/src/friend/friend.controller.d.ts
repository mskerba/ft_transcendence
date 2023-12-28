import { FriendService } from './friend.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
export declare class FriendController {
    private readonly friendService;
    constructor(friendService: FriendService);
    create(createFriendDto: CreateFriendDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateFriendDto: UpdateFriendDto): string;
    remove(id: string): string;
}
