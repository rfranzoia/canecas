import supertest from "supertest";
import app from "../api/api";
import {StatusCodes} from "http-status-codes";
import {TestHelper} from "./TestHelper";
import {Role} from "../domain/Users/Users";
import {mongoConnect, mongoDisconnect} from "../database/mongo";

describe("ProductTypes API test (requires jwt token for most)", () => {
    let loggedUser;

    const TEST_PRODUCT_TYPE = {
        description: "Test Type",
    };

    beforeAll(async () => {
        await mongoConnect();
        loggedUser = await TestHelper.createLoginUserAndAuthenticate(Role.ADMIN);
    });

    afterAll(async () => {
        await mongoDisconnect();
        await TestHelper.deleteLoginTestUser(loggedUser._id);
    });

    describe("given a list of productTypes exists in the database", () => {
        it("should be able to list all productTypes", async () => {
            const response = await supertest(app)
                .get("/api/productTypes")
            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.length).toBeGreaterThan(0);
        });

    });

    describe("given a product type doesn't exists in the database", () => {
        let createdProductType;

        it("should be able to add the new product", async () => {
            const response = await supertest(app)
                .post("/api/productTypes")
                .set("Authorization", "Bearer " + loggedUser.authToken)
                .send(TEST_PRODUCT_TYPE);
        expect(response.statusCode).toBe(StatusCodes.CREATED);
        createdProductType = response.body;
        });

        it("and should be able to delete the recently created product", async () => {
            const response = await supertest(app)
                .delete(`/api/productTypes/${createdProductType._id}`)
                .set("Authorization", "Bearer " + loggedUser.authToken);
            expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);
        });
    });

});