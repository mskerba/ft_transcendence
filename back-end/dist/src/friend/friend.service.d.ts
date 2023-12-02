import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
export declare class FriendService {
    create(createFriendDto: CreateFriendDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateFriendDto: UpdateFriendDto): string;
    remove(id: number): string;
}
