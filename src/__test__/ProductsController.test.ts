import supertest from "supertest";
import app from "../api/api";
import {StatusCodes} from "http-status-codes";
import {TestHelper} from "./TestHelper";
import {ProductDTO} from "../controller/Products/ProductDTO";

describe("Products API test (requires jwt token for most)", () => {

    const CREATED_TEST_PRODUCT = {
        name: "Test Product",
        description: "Some dummy description for a test products that needs it",
        image: "imagePath/imageName.png",
        product_type_id: 1
    };

    beforeAll(async () => {
        await TestHelper.createLoginTestUser();
    });

    afterAll(async () => {
        await TestHelper.deleteLoginTestUser();
    });

    describe("given a list of products exists in the database", () => {
        it("should be able to list all products", async () => {
            const response = await supertest(app)
                .get("/api/products")
            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.data.length).toBeGreaterThan(0);
        });

        it("and should be able to list all products by a given ProductType", async () => {
            const productTypeId = 1;
            const response = await supertest(app)
                .get(`/api/products/productType/${productTypeId}`)
            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.data.length).toBeGreaterThan(0);
        });

        it("and should be able to list all products by a given price range", async () => {
            const startPrice = 0;
            const endPrice = 999;
            const response = await supertest(app)
                .get(`/api/products/price/${startPrice}/${endPrice}`)
            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.data.length).toBeGreaterThan(0);
        });
    });

    describe("given a product doesn't exists in the database", () => {
        let createdProduct: ProductDTO;

        it("should be able to add the new product", async () => {
            const response = await supertest(app)
                .post("/api/products")
                .set("Authorization", "Bearer " + TestHelper.getLoginTestUser().authToken)
                .send(CREATED_TEST_PRODUCT);
        expect(response.statusCode).toBe(StatusCodes.CREATED);
        createdProduct = response.body.data;
        });

        it("and should be able to delete the recently created product", async () => {
            const response = await supertest(app)
                .delete(`/api/products/${createdProduct.id}`)
                .set("Authorization", "Bearer " + TestHelper.getLoginTestUser().authToken);
            expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);
        });
    });

});