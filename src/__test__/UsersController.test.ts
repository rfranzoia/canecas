import supertest from "supertest";
import app from "../api/api";
import {StatusCodes} from "http-status-codes";
import {Role} from "../service/Users/UsersService";
import {LOGIN_TEST_USER, TestHelper} from "./TestHelper";
import {UserDTO} from "../controller/Users/UserDTO";

describe("Users API test (some require jwt token)", () => {

    const CREATE_TEST_USER = {
        role: "USER",
        name: "Created Test User",
        email: "created.test.user@me.com",
        password: "fakepassword",
        phone: "+999 12344",
        address: "Somewhere/Earth"
    }

    beforeAll(async () => {
        await TestHelper.createLoginTestUser();
    });

    afterAll(async () => {
        await TestHelper.deleteLoginTestUser();
    });

    describe("given an user is logged in", () => {
        it("should be able to list all users", async () => {
            const response = await supertest(app)
                .get("/api/users")
                .set("Authorization", "Bearer " + TestHelper.getLoginTestUser().authToken);
            expect(response.statusCode).toBe(StatusCodes.OK);
        });

        it("should be able to list users with the given role", async () => {
            const role = Role.ADMIN;
            const response = await supertest(app)
                .get(`/api/users/role/${role}`)
                .set("Authorization", "Bearer " + TestHelper.getLoginTestUser().authToken);
            expect(response.statusCode).toBe(StatusCodes.OK);
        });

        it("should be able to get an User with a given email", async () => {
            const response = await supertest(app)
                .get(`/api/users/role/${LOGIN_TEST_USER.email}`)
                .set("Authorization", "Bearer " + TestHelper.getLoginTestUser().authToken);
            expect(response.statusCode).toBe(StatusCodes.OK);
        });
    });

    describe("given an user is not logged in", () => {
        it("should not be able to list users", async () => {
            const response = await supertest(app)
                .get("/api/users")
            expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
        });

        it("should not be able to login with invalid credentials", async () => {
            const invalidCredentials = {
                email: "someemail@nowere.com",
                password: "novalidpassword"
            };

            const response = await supertest(app)
                .post("/api/users/login")
                .send({
                    email: invalidCredentials.email,
                    password: invalidCredentials.password
                });
            expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
        });

        it("should be able to login with valid credentials", async () => {
            const response = await supertest(app)
                .post("/api/users/login")
                .send({
                    email: LOGIN_TEST_USER.email,
                    password: LOGIN_TEST_USER.password
                });
            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.data.authToken.trim()).toBeDefined();
        });
    });

    describe("given an user doesn't exists in the database", () => {
        let createdUser: UserDTO;

        it("should be able to create an User", async () => {
            const response = await supertest(app)
                .post("/api/users")
                .send(CREATE_TEST_USER);
            expect(response.statusCode).toBe(StatusCodes.CREATED);
            expect(response.body.data.email).toEqual(CREATE_TEST_USER.email);
            createdUser = response.body.data;
        });

        it("and should be able to delete an existing user if there's an user logged in", async () => {
            const response = await supertest(app)
                .delete(`/api/users/${createdUser.id}`)
                .set("Authorization", "Bearer " + TestHelper.getLoginTestUser().authToken);
            expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);
        });
    });

});