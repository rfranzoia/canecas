import {StatusCodes} from "http-status-codes";
import {ConnectionHelper} from "../database/ConnectionHelper";
import {Role, UsersService} from "../service/Users/UsersService";

beforeAll(async () => {
    await ConnectionHelper.create();
});

afterAll(async () => {
    await ConnectionHelper.close();
});

describe("Users Tests", () => {

    const TEST_USER = {
        role: "USER",
        name: "Test User",
        email: "testuser@me.com",
        password: "somepassword",
        phone: "+999 12344",
        address: "Somewhere/Earth"
    }

    test("List all", async () => {
        const response = await new UsersService().list(0, 0);
        expect(response.statusCode).toBe(StatusCodes.OK);
        expect(response.data.length).toBeGreaterThan(0);
    });

    test("List by Role", async () => {
        const response = await new UsersService().listByRole(Role.ADMIN, 0, 0);
        expect(response.statusCode).toBe(StatusCodes.OK);
        expect(response.data.length).toBeGreaterThan(0);
    });

    test("Create test user", async () => {
        const response = await new UsersService().create({
            role: TEST_USER.role,
            name: TEST_USER.name,
            email: TEST_USER.email,
            password: TEST_USER.password,
            phone: TEST_USER.phone,
            address: TEST_USER.address
        });
        console.log(response);
        expect(response.statusCode)
            .toBe(StatusCodes.CREATED);
    });

    test("Get user by email", async () => {
        const response = await new UsersService().getByEmail(TEST_USER.email);
        expect(response.statusCode).toBe(StatusCodes.OK);
        expect(response.data.email).toEqual(TEST_USER.email);
    });

    test("Login", async () => {
        const response = await new UsersService().authenticate(TEST_USER.email, TEST_USER.password);
        expect(response.statusCode).toBe(StatusCodes.OK);
        expect(response.data.authToken.trim()).toBeDefined();
    });

    test("Remove Test User", async () => {
        const service = new UsersService();
        let response = await service.listByRole(Role.ADMIN, 0, 0);
        expect(response.statusCode).toBe(StatusCodes.OK);
        const authUser = response.data[0];
        response = await service.getByEmail(TEST_USER.email);
        expect(response.statusCode).toBe(StatusCodes.OK);
        const userToDelete = response.data;
        response = await service.delete(userToDelete.id, authUser);
        expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);
    })
});
