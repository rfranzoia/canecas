"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDTO = void 0;
class UserDTO {
    constructor(id, role, name, email, phone, address) {
        this.id = id;
        this.role = role;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;
    }
    static mapToDTO(user) {
        return new UserDTO(user.id, user.role, user.name, user.email, user.phone, user.address);
    }
    static mapToListDTO(users) {
        return users.map(user => UserDTO.mapToDTO(user));
    }
}
exports.UserDTO = UserDTO;
//# sourceMappingURL=UserDTO.js.map