import supertest from "supertest";
import {TestHelper} from "./TestHelper";
import app from "../api/api";
import {StatusCodes} from "http-status-codes";

describe("Orders API test (some require jwt token)", () => {

    beforeAll(async () => {
        await TestHelper.createLoginTestUser();
    });

    afterAll(async () => {
        await TestHelper.deleteLoginTestUser();
    });

    describe("given a list of order exists in the database", () => {
        it("should be able to list all orders", async () => {
            const response = await supertest(app)
                .get("/api/orders")
                .set("Authorization", "Bearer " + TestHelper.getLoginTestUser().authToken);
            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.data.length).toBeGreaterThan(0);
        });

        it("should be able to list all orders by a date range", async () => {
            const startDate = new Date(2022, 0, 1).toISOString().split("T")[0];
            const endDate = new Date(2022, 11, 31).toISOString().split("T")[0];
            const response = await supertest(app)
                .get(`/api/orders/from/${startDate}/to/${endDate}`)
                .set("Authorization", "Bearer " + TestHelper.getLoginTestUser().authToken);
            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.data.length).toBeGreaterThan(0);
        });

        it("should be able to retrieve an order by its ID", async () => {
            let response = await supertest(app)
                .get("/api/orders")
                .set("Authorization", "Bearer " + TestHelper.getLoginTestUser().authToken);
            const orderId = response.body.data[0].id;
            response = await supertest(app)
                .get(`/api/orders/${orderId}`)
                .set("Authorization", "Bearer " + TestHelper.getLoginTestUser().authToken);
            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.data.id).toEqual(orderId);
        });
    });

});