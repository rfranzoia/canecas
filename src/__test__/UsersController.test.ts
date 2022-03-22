import supertest from "supertest";
import app from "../api/api";
import {StatusCodes} from "http-status-codes";
import {UsersService} from "../service/Users/UsersService";
import {ConnectionHelper} from "../database/ConnectionHelper";

describe("api call test", () => {

    const TEST_USER = {
        role: "ADMIN",
        name: "Test User",
        email: "anothertestuser@me.com",
        password: "somepassword",
        phone: "+999 12344",
        address: "Somewhere/Earth"
    }

    let createdTestUser;

    beforeAll(async () => {
        // create a test user and login to get access token
        await ConnectionHelper.create();
        let response = await new UsersService().create({
            role: TEST_USER.role,
            name: TEST_USER.name,
            email: TEST_USER.email,
            password: TEST_USER.password,
            phone: TEST_USER.phone,
            address: TEST_USER.address
        });
        response = await new UsersService().authenticate(TEST_USER.email, TEST_USER.password);
        createdTestUser = response.data;
    });

    afterAll(async () => {
        // delete test user
        await new UsersService().delete(createdTestUser.id, createdTestUser);
        await ConnectionHelper.close();
    });

    test("user listing with token", async () => {
        const response = await supertest(app)
            .get("/api/users")
            .set("Authorization", "Bearer " + createdTestUser.authToken);
        expect(response.statusCode).toBe(StatusCodes.OK);
    });

    test("user listing without token", async () => {
        const response = await supertest(app)
            .get("/api/users")
        expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });

})