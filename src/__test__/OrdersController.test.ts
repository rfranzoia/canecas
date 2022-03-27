import supertest from "supertest";
import app from "../api/api";
import {StatusCodes} from "http-status-codes";
import {TestHelper} from "./TestHelper";
import {Role} from "../domain/Users/Users";
import {ordersRepository} from "../domain/orders/OrdersRepository";
import {OrderStatus} from "../domain/orders/Orders";

describe("Orders API test (requires jwt token)", () => {

    beforeAll( async () => {
    });

    afterAll(async () => {
    });

    describe("given a list of order exists in the database", () => {
        describe("and logged user is ADMIN", () => {
            let orders;
            let loggedUser;

            beforeAll(async () => {
                loggedUser = await TestHelper.createLoginUserAndAuthenticate(Role.ADMIN);
            });

            afterAll(async () => {
                await TestHelper.deleteLoginTestUser(loggedUser._id);
            });

            it("should be able to list all orders", async () => {
                const response = await supertest(app)
                    .get("/api/orders")
                    .set("Authorization", "Bearer " + loggedUser.authToken);
                expect(response.statusCode).toBe(StatusCodes.OK);
                expect(response.body.data.length).toBeGreaterThan(0);
                orders = [...response.body.data];
            });

            it("should be able to list all orders by a date range", async () => {
                const startDate = new Date(2022, 0, 1).toISOString().split("T")[0];
                const endDate = new Date(2022, 11, 31).toISOString().split("T")[0];
                const response = await supertest(app)
                    .get(`/api/orders/from/${startDate}/to/${endDate}`)
                    .set("Authorization", "Bearer " + loggedUser.authToken);
                expect(response.statusCode).toBe(StatusCodes.OK);
                expect(response.body.data.length).toBeGreaterThan(0);
            });

            it("should be able to retrieve an order by its ID", async () => {
                const orderId = orders[0].id;
                const response = await supertest(app)
                    .get(`/api/orders/${orderId}`)
                    .set("Authorization", "Bearer " + loggedUser.authToken);
                expect(response.statusCode).toBe(StatusCodes.OK);
                expect(response.body.data.id).toEqual(orderId);
            });
        });

    });

    describe("given a customer order doesn't exists in the database", () => {
        describe("and the logged user is a customer", () => {
            let order;
            let loggedUser;

            beforeAll(async () => {
                loggedUser = await TestHelper.createLoginUserAndAuthenticate(Role.USER);
            });

            afterAll(async () => {
                await TestHelper.deleteLoginTestUser(loggedUser._id);
            });


            it("should be able to create a new order", async () => {
                // attempts to create the order
                const response = await supertest(app)
                    .post("/api/orders")
                    .set("Authorization", "Bearer " + loggedUser.authToken)
                    .send(getCustomerOrder(loggedUser));
                expect(response.statusCode).toBe(StatusCodes.CREATED);
                order = response.body.data;

            });

            it("and should be able to delete the recently created order", async () => {
                let response = await supertest(app)
                    .delete(`/api/orders/${order.id}`)
                    .set("Authorization", "Bearer " + loggedUser.authToken);
                expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);
            });

        });

    });

    describe("given an order exists in the database", () => {
        let createdOrder;
        let loggedUser;

        afterAll(async () => {
            // since the order status will likely to be changed and the endpoints don't allow
            // removing orders with status above 0, it's required the use of the
            // repository directly in this case
            await ordersRepository.delete(createdOrder._id);

            // deletes the created user/customer
            await supertest(app)
                .delete(`/api/users/${createdOrder.user.id}`)
                .set("Authorization", "Bearer " + loggedUser.authToken);
        });

        describe("given the logged user is a customer", () => {

            beforeAll(async () => {
                // login as cusstomer
                loggedUser = await TestHelper.createLoginUserAndAuthenticate(Role.USER);

                // creates an order
                const response = await supertest(app)
                    .post("/api/orders")
                    .set("Authorization", "Bearer " + loggedUser.authToken)
                    .send(getCustomerOrder(loggedUser));
                createdOrder = response.body.data;
            });

            it("should NOT be able to change status by sa customer when new status not 1 or 9", async () => {
                const response = await supertest(app)
                    .put(`/api/orders/${createdOrder.id}`)
                    .set("Authorization", "Bearer " + loggedUser.authToken)
                    .send({
                        orderStatus: "2",
                        changeReason: "Testing purposes"
                    });
                expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
            });

            it("should be able to move status to OrderStatus.CREATED", async () => {
                const response = await supertest(app)
                    .put(`/api/orders/${createdOrder.id}`)
                    .set("Authorization", "Bearer " + loggedUser.authToken)
                    .send({
                        orderStatus: "1",
                        changeReason: "Order created by customer"
                    });
                expect(response.statusCode).toBe(StatusCodes.OK);
            });

            it("and the OrderHistory should be properly updated", async () => {
                const response = await supertest(app)
                    .get(`/api/orders/history/${createdOrder.id}`)
                    .set("Authorization", "Bearer " + loggedUser.authToken)
                expect(response.statusCode).toBe(StatusCodes.OK);
                expect(response.body.data.length).toBeGreaterThan(0);
            });
        });

        describe("given the logged user is an ADMIN", () => {

            beforeAll(async () => {
                // login as admin
                loggedUser = await TestHelper.createLoginUserAndAuthenticate(Role.ADMIN);
            });

            it("should be able to change status", async () => {
                const response = await supertest(app)
                    .put(`/api/orders/${createdOrder.id}`)
                    .set("Authorization", "Bearer " + loggedUser.authToken)
                    .send({
                        orderStatus: OrderStatus.IN_PROGRESS,
                        changeReason: "Testing purposes"
                    });
                expect(response.statusCode).toBe(StatusCodes.OK);
            });

            it("and the OrderHistory should be properly updated", async () => {
                const response = await supertest(app)
                    .get(`/api/orders/history/${createdOrder.id}`)
                    .set("Authorization", "Bearer " + loggedUser.authToken)
                expect(response.statusCode).toBe(StatusCodes.OK);
                expect(response.body.data.length).toBeGreaterThan(1);
            });
        });
    });


});

const getCustomerOrder = (createdUser) => {
    return {
        user_id: createdUser.id,
        orderItems: [
            {
                product_id: 5,
                quantity: 2,
                price: 100,
                discount: 0
            },
            {
                product_id: 3,
                quantity: 1,
                price: 50,
                discount: 0
            },
            {
                product_id: 6,
                quantity: 1,
                price: 50,
                discount: 0
            }
        ]
    };
}