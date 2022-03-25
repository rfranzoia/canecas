import supertest from "supertest";
import app from "../api/api";
import {StatusCodes} from "http-status-codes";
import {Role} from "../service/Users/UsersService";
import {LOGIN_USER, TestHelper} from "./TestHelper";
import {UserDTO} from "../controller/Users/UserDTO";
import {ConnectionHelper} from "../database/ConnectionHelper";

describe("Users API test (some require jwt token)", () => {
    let loggedUser: UserDTO;
    
    beforeAll(async () => {
        await ConnectionHelper.create();
        loggedUser = await TestHelper.createLoginUserAndAuthenticate(Role.ADMIN);
    });

    afterAll(async () => {
        await TestHelper.deleteLoginTestUser(loggedUser.id);
        await ConnectionHelper.close();
    });

    describe("given an user is logged in", () => {
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
                .get(`/api/users/role/${LOGIN_USER.email}`)
                .set("Authorization", "Bearer " + loggedUser.authToken);
            expect(response.statusCode).toBe(StatusCodes.OK);
        });

        it("should NOT be able to find by an invalid ID", async () => {
            const id = 0;
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
                    email: loggedUser.email,
                    password: LOGIN_USER.password
                });
            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.data.authToken.trim()).toBeDefined();
        });
    });

    describe("given an user doesn't exists in the database", () => {
        let createdUser: UserDTO;

        it("should be able to create an User", async () => {
            const testUser = TestHelper.getTestUser();

            const response = await supertest(app)
                .post("/api/users")
                .send(testUser);
            expect(response.statusCode).toBe(StatusCodes.CREATED);
            expect(response.body.data.email).toEqual(testUser.email);
            createdUser = response.body.data;
        });

        it("and should be able to delete an existing user if there's an user logged in", async () => {
            const response = await supertest(app)
                .delete(`/api/users/${createdUser.id}`)
                .set("Authorization", "Bearer " + loggedUser.authToken);
            expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);
        });
    });

});