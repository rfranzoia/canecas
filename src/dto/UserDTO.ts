import {Users} from "../entity/Users";

export class UserDTO {
    userType: string;
    name: string;
    email: string;
    phone: string;
    address: string;

    constructor(userType: string, name: string, email: string, phone: string, address: string) {
        this.userType = userType;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;
    }

    static mapToDTO(user: Users): UserDTO {
        return new UserDTO(user.userType, user.name, user.email, user.phone, user.address);
    }

    static mapToListDTO(users: Users[]): UserDTO[] {
        return users.map(user => UserDTO.mapToDTO(user));
    }
}