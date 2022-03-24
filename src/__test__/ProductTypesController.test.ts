import supertest from "supertest";
import app from "../api/api";
import {StatusCodes} from "http-status-codes";
import {TestHelper, TestUser} from "./TestHelper";
import {ProductTypeDTO} from "../controller/Products/ProductTypeDTO";
import {Role} from "../service/Users/UsersService";
import {ConnectionHelper} from "../database/ConnectionHelper";

describe("ProductTypes API test (requires jwt token for most)", () => {
    let loggedUser: TestUser;

    const TEST_PRODUCT_TYPE = {
        description: "Some dummy description for a test productTypes that needs it",
        image: "imagePath/imageName.png",
    };

    beforeAll(async () => {
        await ConnectionHelper.create();
        loggedUser = await TestHelper.createLoginUserAndAuthenticate(Role.ADMIN);
    });

    afterAll(async () => {
        await TestHelper.deleteLoginTestUser(loggedUser.id);
        await ConnectionHelper.close();
    });

    describe("given a list of productTypes exists in the database", () => {
        it("should be able to list all productTypes", async () => {
            const response = await supertest(app)
                .get("/api/productTypes")
            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.data.length).toBeGreaterThan(0);
        });

    });

    describe("given a product doesn't exists in the database", () => {
        let createdProductType: ProductTypeDTO;

        it("should be able to add the new product", async () => {
            const response = await supertest(app)
                .post("/api/productTypes")
                .set("Authorization", "Bearer " + loggedUser.authToken)
                .send(TEST_PRODUCT_TYPE);
        expect(response.statusCode).toBe(StatusCodes.CREATED);
        createdProductType = response.body.data;
        });

        it("and should be able to delete the recently created product", async () => {
            const response = await supertest(app)
                .delete(`/api/productTypes/${createdProductType.id}`)
                .set("Authorization", "Bearer " + loggedUser.authToken);
            expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);
        });
    });

});