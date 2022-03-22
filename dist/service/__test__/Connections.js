"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Connection = {
    async create() {
        await (0, typeorm_1.createConnection)();
    },
    async close() {
        await (0, typeorm_1.getConnection)().close();
    },
    async clear() {
        const connection = (0, typeorm_1.getConnection)();
        const entities = connection.entityMetadatas;
        entities.forEach(async (entity) => {
            const repository = connection.getRepository(entity.name);
            await repository.query(`DELETE FROM ${entity.tableName}`);
        });
    },
};
exports.default = Connection;
//# sourceMappingURL=Connections.js.map