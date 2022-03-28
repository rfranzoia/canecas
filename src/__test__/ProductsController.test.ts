import supertest from "supertest";
import app from "../api/api";
import {StatusCodes} from "http-status-codes";
import {TestHelper} from "./TestHelper";
import {Role} from "../domain/Users/Users";
import {mongoConnect, mongoDisconnect} from "../database/mongo";

describe("Products API test (requires jwt token for most)", () => {
    let loggedUser;

    const TEST_PRODUCT = {
        name: "Test Product",
        description: "Some dummy description for a test products that needs it",
        price: 10.9,
        type: "Caneca"
    };

    beforeAll(async () => {
        await mongoConnect();
        loggedUser = await TestHelper.createLoginUserAndAuthenticate(Role.ADMIN);
    });

    afterAll(async () => {
        await mongoDisconnect();
        await TestHelper.deleteLoginTestUser(loggedUser._id);
    });

    describe("given a product doesn't exists in the database", () => {
        let createdProduct;

        it("should be able to add the new product", async () => {
            const response = await supertest(app)
                .post("/api/products")
                .set("Authorization", "Bearer " + loggedUser.authToken)
                .send(TEST_PRODUCT);
            expect(response.statusCode).toBe(StatusCodes.CREATED);
            createdProduct = response.body;
        });

        it("and should be able to delete the recently created product", async () => {
            const response = await supertest(app)
                .delete(`/api/products/${createdProduct._id}`)
                .set("Authorization", "Bearer " + loggedUser.authToken);
            expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);
        });
    });

    describe("given a list of products exists in the database", () => {
        it("should be able to list all products", async () => {
            const response = await supertest(app)
                .get("/api/products")
            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it("and should be able to list all products by a given ProductType", async () => {
            const type = "Caneca";
            const response = await supertest(app)
                .get(`/api/products/type/${type}`)
            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it("and should be able to list all products by a given price range", async () => {
            const startPrice = 0;
            const endPrice = 999;
            const response = await supertest(app)
                .get(`/api/products/price/${startPrice}/${endPrice}`)
            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.length).toBeGreaterThan(0);
        });
    });

});