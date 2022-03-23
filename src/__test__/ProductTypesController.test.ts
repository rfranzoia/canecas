import supertest from "supertest";
import app from "../api/api";
import {StatusCodes} from "http-status-codes";
import {TestHelper} from "./TestHelper";

describe("ProductTypes API test (requires jwt token for most)", () => {

    const CREATED_TEST_PRODUCT_TYPE = {
        description: "Some dummy description for a test productTypes that needs it",
        image: "imagePath/imageName.png",
    };

    beforeAll(async () => {
        await TestHelper.createLoginTestUser();
    });

    afterAll(async () => {
        await TestHelper.deleteLoginTestUser();
    });

    describe("given a list of productTypes exists in the database", () => {
        it("should be able to list all productTypes", async () => {
            const response = await supertest(app)
                .get("/api/productTypes")
                .set("Authorization", "Bearer " + TestHelper.getLoginTestUser().authToken);
            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.data.length).toBeGreaterThan(0);
        });

    });

    describe("given a product doesn't exists in the database", () => {
        it("should be able to add the new product", async () => {
            const response = await supertest(app)
                .post("/api/productTypes")
                .set("Authorization", "Bearer " + TestHelper.getLoginTestUser().authToken)
                .send(CREATED_TEST_PRODUCT_TYPE);
        expect(response.statusCode).toBe(StatusCodes.CREATED);
        });

        it("and should be able to find and delete de recently created product", async () => {
            let response = await supertest(app)
                .get(`/api/productTypes/description/${CREATED_TEST_PRODUCT_TYPE.description}`)
                .set("Authorization", "Bearer " + TestHelper.getLoginTestUser().authToken);

            response = await supertest(app)
                .delete(`/api/productTypes/${response.body.data.id}`)
                .set("Authorization", "Bearer " + TestHelper.getLoginTestUser().authToken);
            expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);
        });
    });

});