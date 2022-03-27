import randomEmail from "random-email";
import UnauthorizedError from "../utils/errors/UnauthorizedError";
import logger from "../utils/Logger";
import {userService} from "../service/users/UsersService";

export const LOGIN_USER: TestUser = {
    role: "ADMIN",
    name: "Login Admin User Test",
    email: "loginadminusertest@me.com",
    password: "somepassword",
    phone: "+999 12346344",
    address: "Somewhere/Earth"
}

export const TEST_USER: TestUser = {
    role: "USER",
    name: "Created Test User",
    email: "created.test.user@me.com",
    password: "fakepassword",
    phone: "+999 12344",
    address: "Somewhere/Earth"
}


export interface TestUser {
    id?: number;
    role: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    authToken?: string;
}

export const TestHelper = {

    async createLoginUserAndAuthenticate(role: string) {
        // create a test user and login to get access token
        let user = {
            ...LOGIN_USER,
            role: role,
            email: randomEmail(),
        }

        user = await userService.create(user);
        const response = await userService.authenticate(user.email, LOGIN_USER.password);
        if (response instanceof UnauthorizedError) {
            logger.error("User not authorized to login with the provided credentials", response);
        }
        return response;
    },

    async deleteLoginTestUser(userId: string) {
        // delete test user
        await userService.delete(userId);
    },

    getTestUser(): TestUser {
        return {
            ...TEST_USER,
            email: randomEmail()
        };
    }
}