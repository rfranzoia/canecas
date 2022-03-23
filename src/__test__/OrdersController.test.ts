import supertest from "supertest";
import {TestHelper} from "./TestHelper";
import app from "../api/api";
import {StatusCodes} from "http-status-codes";
import {OrderDTO} from "../controller/Orders/OrderDTO";

describe("Orders API test (some require jwt token)", () => {

    beforeAll(async () => {
        await TestHelper.createLoginTestUser();
    });

    afterAll(async () => {
        await TestHelper.deleteLoginTestUser();
    });

    describe("given a list of order exists in the database", () => {
        let orders: OrderDTO[];

        it("should be able to list all orders", async () => {
            const response = await supertest(app)
                .get("/api/orders")
                .set("Authorization", "Bearer " + TestHelper.getLoginTestUser().authToken);
            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.data.length).toBeGreaterThan(0);
            orders = [...response.body.data];
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
            const orderId = orders[0].id;
            const response = await supertest(app)
                .get(`/api/orders/${orderId}`)
                .set("Authorization", "Bearer " + TestHelper.getLoginTestUser().authToken);
            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.data.id).toEqual(orderId);
        });
    });

});