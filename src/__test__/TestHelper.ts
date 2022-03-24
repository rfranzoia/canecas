import {ConnectionHelper} from "../database/ConnectionHelper";
import {UsersService} from "../service/Users/UsersService";
import randomEmail from "random-email";

export const LOGIN_TEST_USER = {
    role: "ADMIN",
    name: "Test User",
    email: "anothertestuser@me.com",
    password: "somepassword",
    phone: "+999 12344",
    address: "Somewhere/Earth"
}

export const CREATE_TEST_USER: TestUser = {
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

let loginTestUser: TestUser;

export const TestHelper = {

    async createLoginTestUser() {
        // create a test user and login to get access token
        await ConnectionHelper.create();
        let response = await new UsersService().create({
            role: LOGIN_TEST_USER.role,
            name: LOGIN_TEST_USER.name,
            email: LOGIN_TEST_USER.email,
            password: LOGIN_TEST_USER.password,
            phone: LOGIN_TEST_USER.phone,
            address: LOGIN_TEST_USER.address
        });
        response = await new UsersService().authenticate(LOGIN_TEST_USER.email, LOGIN_TEST_USER.password);
        loginTestUser = response.data;
    },

    async deleteLoginTestUser() {
        // delete test user
        await new UsersService().delete(loginTestUser.id);
        await ConnectionHelper.close();
    },

    getLoginTestUser(): TestUser {
        return loginTestUser;
    },

    getTestUser(): TestUser {
        return {
            ...CREATE_TEST_USER,
            email: randomEmail()
        };
    }
}