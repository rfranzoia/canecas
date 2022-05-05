import { StatusCodes } from "http-status-codes";
import supertest from "supertest";
import app from "../api/api";
import { mongoConnect, mongoDisconnect } from "../database/mongo";
import { Role } from "../domain/Users";
import { productService } from "../service/ProductsService";
import { TestHelper } from "./TestHelper";

describe("Products API test (requires jwt token for most)", () => {
    let loggedUser;

    beforeAll(async () => {
        await mongoConnect();
        loggedUser = await TestHelper.createTestUserAndAuthenticate(Role.ADMIN);
    });

    afterAll(async () => {
        await TestHelper.deleteAllTestUsers();
        await mongoDisconnect();
    });

    describe("given a product doesn't exists in the database", () => {
        let createdProduct;

        it("should be able to add the new product", async () => {
            const response = await supertest(app)
                .post("/api/products")
                .set("Authorization", "Bearer " + loggedUser.authToken)
                .send(getTestProduct());
            expect(response.statusCode).toBe(StatusCodes.CREATED);
            createdProduct = response.body.data;
        });

        it("and should be able to delete the recently created product", async () => {
            const response = await supertest(app)
                .delete(`/api/products/${createdProduct._id}`)
                .set("Authorization", "Bearer " + loggedUser.authToken);
            expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);
        });
    });

    describe("given a list of products exists in the database", () => {
        let sampleProduct;

        beforeAll(async () => {
            const testProduct = getTestProduct();
            sampleProduct = await productService.create(testProduct);
        });

        afterAll(async () => {
            await productService.delete(sampleProduct._id);
        });

        it("should be able to list all products", async () => {
            const response = await supertest(app)
                .get("/api/products")
            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.data.length).toBeGreaterThan(0);
        });

    });

});

const getTestProduct = () => {
    const id = new Date(Date.now()).toISOString();
    return {
        name: "Test Product ".concat(id),
        description: "Some dummy description for a test products that needs it",
        price: 10.9,
        image: "some-image.jpg"
    };
}