import supertest from "supertest";
import app from "../api/api";
import {StatusCodes} from "http-status-codes";
import {Role} from "../domain/Users/Users";
import {TestHelper} from "./TestHelper";
import {mongoConnect, mongoDisconnect} from "../database/mongo";

describe("ProductTypes API test (requires jwt token for most)", () => {
    let loggedUser;

    beforeAll(async () => {
        await mongoConnect();
        loggedUser = await TestHelper.createTestUserAndAuthenticate(Role.ADMIN);
    });

    afterAll(async () => {
        await TestHelper.deleteAllTestUsers();
        await mongoDisconnect();
    });

    describe("given a product type doesn't exists in the database", () => {
        let createdProductType;

        it("should be able to create a new type", async () => {
            const response = await supertest(app)
                .post("/api/productTypes")
                .set("Authorization", "Bearer " + loggedUser.authToken)
                .send(getTestType());
            expect(response.statusCode).toBe(StatusCodes.CREATED);
            createdProductType = response.body;
        });

        it("should be able to list types in the database", async () => {
            const response = await supertest(app)
                .get("/api/productTypes")
            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it("and should be able to delete the created type", async () => {
            const response = await supertest(app)
                .delete(`/api/productTypes/${createdProductType._id}`)
                .set("Authorization", "Bearer " + loggedUser.authToken);
            expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);
        });
    });
});

const getTestType = () => {
    return {
        description: "Test Type",
    };
}