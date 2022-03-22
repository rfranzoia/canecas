import {createConnection, getConnection} from "typeorm";

export const ConnectionHelper = {

    async create() {
        await createConnection();
    },

    async close() {
        getConnection().close();
    }
}