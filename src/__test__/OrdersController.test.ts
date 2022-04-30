import { StatusCodes } from "http-status-codes";
import supertest from "supertest";
import app from "../api/api";
import { mongoConnect, mongoDisconnect } from "../database/mongo";
import { Order, OrderStatus } from "../domain/orders/Orders";
import { ordersRepository } from "../domain/orders/OrdersRepository";
import { Role } from "../domain/Users/Users";
import { userRepository } from "../domain/Users/UsersRepository";
import { ordersService } from "../service/orders/OrdersService";
import { TestHelper } from "./TestHelper";

describe("Orders API test (requires jwt token)", () => {

    beforeAll(async () => {
        await mongoConnect();
    });

    afterAll(async () => {
        await TestHelper.deleteAllTestUsers();
        await mongoDisconnect();
    });

    describe("given a customer order doesn't exists in the database", () => {
        describe("and the logged user is a customer", () => {
            let order;
            let loggedUser;

            beforeAll(async () => {
                loggedUser = await TestHelper.createTestUserAndAuthenticate(Role.USER);
            });

            it("should be able to create a new order", async () => {
                // attempts to create the order
                const response = await supertest(app)
                    .post("/api/orders")
                    .set("Authorization", "Bearer " + loggedUser.authToken)
                    .send(getTestOrder(loggedUser));
                expect(response.statusCode).toBe(StatusCodes.CREATED);
                order = response.body;

            });

            it("and should be able to delete the recently created order", async () => {
                let response = await supertest(app)
                    .delete(`/api/orders/${order._id}`)
                    .set("Authorization", "Bearer " + loggedUser.authToken);
                expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);
            });

        });

    });

    describe("given a list of order exists in the database", () => {
        describe("and logged user is ADMIN", () => {
            let orders;
            let loggedUser;
            let sampleTestOrder;

            beforeAll(async () => {
                loggedUser = await TestHelper.createTestUserAndAuthenticate(Role.ADMIN);

                const testOrder = getTestOrder(loggedUser);
                const o: Order = {
                    orderDate: new Date(testOrder.orderDate),
                    userEmail: testOrder.userEmail,
                    items: testOrder.items
                }

                sampleTestOrder = await ordersService.create(o);
            });

            afterAll(async () => {
                await ordersRepository.delete(sampleTestOrder._id);
            })

            it("should be able to list all orders", async () => {
                const response = await supertest(app)
                    .get("/api/orders")
                    .set("Authorization", "Bearer " + loggedUser.authToken);
                expect(response.statusCode).toBe(StatusCodes.OK);
                expect(response.body.length).toBeGreaterThan(0);
                orders = [...response.body];
            });

            it("should be able to list all orders by a date range", async () => {
                const startDate = new Date(2022, 0, 1).toISOString().split("T")[0];
                const endDate = new Date(2022, 11, 31).toISOString().split("T")[0];
                const response = await supertest(app)
                    .get(`/api/orders/from/${startDate}/to/${endDate}`)
                    .set("Authorization", "Bearer " + loggedUser.authToken);
                expect(response.statusCode).toBe(StatusCodes.OK);
                expect(response.body.length).toBeGreaterThan(0);
            });

            it("should be able to retrieve an order by its ID", async () => {
                const orderId = orders[0]._id;
                const response = await supertest(app)
                    .get(`/api/orders/${orderId}`)
                    .set("Authorization", "Bearer " + loggedUser.authToken);
                expect(response.statusCode).toBe(StatusCodes.OK);
                expect(response.body._id).toEqual(orderId);
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

            // identify the user/customer in the created order
            const orderUser = await userRepository.findByEmail(createdOrder.userEmail);

            // deletes the created user/customer
            await supertest(app)
                .delete(`/api/users/${orderUser._id}`)
                .set("Authorization", "Bearer " + loggedUser.authToken);
        });

        describe("given the logged user is a customer", () => {

            beforeAll(async () => {
                // login as cusstomer
                loggedUser = await TestHelper.createTestUserAndAuthenticate(Role.USER);

                // creates an order
                const response = await supertest(app)
                    .post("/api/orders")
                    .set("Authorization", "Bearer " + loggedUser.authToken)
                    .send(getTestOrder(loggedUser));
                createdOrder = response.body;
            });

            it("should NOT be able to change status by sa customer when new status not 1 or 9", async () => {
                const response = await supertest(app)
                    .put(`/api/orders/${createdOrder._id}`)
                    .set("Authorization", "Bearer " + loggedUser.authToken)
                    .send({
                        status: "2",
                        changeReason: "Testing purposes"
                    });
                expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
            });

            it("should be able to move status to OrderStatus.CONFIRMED_ORDER", async () => {
                const response = await supertest(app)
                    .put(`/api/orders/${createdOrder._id}`)
                    .set("Authorization", "Bearer " + loggedUser.authToken)
                    .send({
                        status: OrderStatus.CONFIRMED_ORDER,
                    });
                expect(response.statusCode).toBe(StatusCodes.OK);
            });

            it("and the OrderHistory should be properly updated", async () => {
                const response = await supertest(app)
                    .get(`/api/orders/${createdOrder._id}`)
                    .set("Authorization", "Bearer " + loggedUser.authToken)
                expect(response.statusCode).toBe(StatusCodes.OK);
                expect(response.body.statusHistory.length).toBeGreaterThan(0);
            });
        });

        describe("given the logged user is an ADMIN", () => {

            beforeAll(async () => {
                // login as admin
                loggedUser = await TestHelper.createTestUserAndAuthenticate(Role.ADMIN);
            });

            it("should be able to change status", async () => {
                const response = await supertest(app)
                    .put(`/api/orders/${createdOrder._id}`)
                    .set("Authorization", "Bearer " + loggedUser.authToken)
                    .send({
                        status: OrderStatus.IN_PRODUCTION,
                    });
                expect(response.statusCode).toBe(StatusCodes.OK);
            });

            it("and the OrderHistory should be properly updated", async () => {
                const response = await supertest(app)
                    .get(`/api/orders/${createdOrder._id}`)
                    .set("Authorization", "Bearer " + loggedUser.authToken)
                expect(response.statusCode).toBe(StatusCodes.OK);
                expect(response.body.statusHistory.length).toBeGreaterThan(1);
            });
        });
    });


});

const getTestOrder = (createdUser) => {
    return {
        orderDate: "2022-03-27",
        userEmail: createdUser.email,
        items: [
            {
                product: "Caneca com arte",
                drawings: 1,
                background: "empty",
                price: 59.90,
                amount: 2
            },
            {
                product: "Arte",
                drawings: 1,
                background: "empty",
                price: 35.90,
                amount: 1
            }
        ]
    }
}