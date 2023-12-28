"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFriendDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_friend_dto_1 = require("./create-friend.dto");
class UpdateFriendDto extends (0, mapped_types_1.PartialType)(create_friend_dto_1.CreateFriendDto) {
}
exports.UpdateFriendDto = UpdateFriendDto;
//# sourceMappingURL=update-friend.dto.js.map