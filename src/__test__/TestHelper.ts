import randomEmail from "random-email";
import { userRepository } from "../domain/Users/UsersRepository";
import { userService } from "../service/users/UsersService";
import UnauthorizedError from "../utils/errors/UnauthorizedError";
import logger from "../utils/Logger";

export const TEST_USER: TestUser = {
    name: "Test User",
    email: "loginadminusertest@me.com",
    password: "somepassword",
    phone: "+999 12346344",
    address: "Somewhere/Earth"
}

export interface TestUser {
    id?: number;
    role?: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    authToken?: string;
}

export const TestHelper = {

    async createTestUser(role: string) {
        return {
            ...TEST_USER,
            role: role,
            email: randomEmail(),
        };
    },

    async authenticateTestUser(user) {
        const response = await userService.authenticate(user.email, TEST_USER.password);
        if (response instanceof UnauthorizedError) {
            logger.error("User not authorized to login with the provided credentials", response);
        }
        return response;
    },

    async createTestUserAndAuthenticate(role: string) {
        const user = await userService.create(await TestHelper.createTestUser(role));
        return TestHelper.authenticateTestUser(user);
    },

    async deleteAllTestUsers() {
        const users = await userRepository.findAll({}, 0, 0);
        for (let i = 0; i < users.length; i++) {
            if (users[i].name === TEST_USER.name) {
                await userRepository.delete(users[i].id);
            }
        }
    }
}