import {Users} from "../entity/Users";

export class UserDTO {
    id: number;
    role: string;
    name: string;
    email: string;
    phone: string;
    address: string;

    constructor(id: number, role: string, name: string, email: string, phone: string, address: string) {
        this.id = id;
        this.role = role;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;
    }

    static mapToDTO(user: Users): UserDTO {
        return new UserDTO(user.id, user.role, user.name, user.email, user.phone, user.address);
    }

    static mapToListDTO(users: Users[]): UserDTO[] {
        return users.map(user => UserDTO.mapToDTO(user));
    }
}