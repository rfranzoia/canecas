import { StatusCodes } from "http-status-codes";
import supertest from "supertest";
import app from "../api/api";
import { mongoConnect, mongoDisconnect } from "../database/mongo";
import { Role } from "../domain/Users/Users";
import { TEST_USER, TestHelper } from "./TestHelper";

describe("Users API test (some require jwt token)", () => {
    let loggedUser;

    beforeAll(async () => {
        await mongoConnect();
    });

    afterAll(async () => {
        await TestHelper.deleteAllTestUsers();
        await mongoDisconnect();
    });

    describe("given an user doesn't exists in the database", () => {
        let createdUser;

        it("should be able to create an User", async () => {
            //const testUser = TestHelper.getTestUser();
            const testUser = await TestHelper.createTestUser(Role.USER);

            const response = await supertest(app)
                .post("/api/users")
                .send(testUser);
            expect(response.statusCode).toBe(StatusCodes.CREATED);
            expect(response.body.email).toEqual(testUser.email);
            createdUser = response.body;
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
                    email: createdUser.email,
                    password: TEST_USER.password
                });
            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.authToken).toBeDefined();
            loggedUser = response.body;
        });

        it("and should be able to delete an existing user if there's an user logged in", async () => {
            const response = await supertest(app)
                .delete(`/api/users/${createdUser._id}`)
                .set("Authorization", "Bearer " + loggedUser.authToken);
            expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);
        });

    });

    describe("given an user is not logged in", () => {
        it("should not be able to list users", async () => {
            const response = await supertest(app)
                .get("/api/users")
            expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
        });


    });

    describe("given an user is logged in", () => {
        let loginUser;

        beforeAll(async () => {
            loginUser = await TestHelper.createTestUser(Role.ADMIN);
            loggedUser = await TestHelper.createTestUserAndAuthenticate(Role.ADMIN);
        });

        it("should be able to list all users", async () => {
            const response = await supertest(app)
                .get("/api/users")
                .set("Authorization", "Bearer " + loggedUser.authToken);
            expect(response.statusCode).toBe(StatusCodes.OK);
        });

        it("should be able to list users with the given role", async () => {
            const role = Role.ADMIN;
            const response = await supertest(app)
                .get(`/api/users/role/${role}`)
                .set("Authorization", "Bearer " + loggedUser.authToken);
            expect(response.statusCode).toBe(StatusCodes.OK);
        });

        it("should be able to get an User with a given email", async () => {
            const response = await supertest(app)
                .get(`/api/users/email/${loggedUser.email}`)
                .set("Authorization", "Bearer " + loggedUser.authToken);
            expect(response.statusCode).toBe(StatusCodes.OK);
        });

        it("should NOT be able to find by an invalid ID", async () => {
            const id = "6240d49113b4a3db04bce0d2";
            const response = await supertest(app)
                .get(`/api/users/${id}`)
                .set("Authorization", "Bearer " + loggedUser.authToken);
            expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
        });

        it("should NOT be able to find by an invalid email", async () => {
            const email = "invalid-email";
            const response = await supertest(app)
                .get(`/api/users/email/${email}`)
                .set("Authorization", "Bearer " + loggedUser.authToken);
            expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
        });
    });

});