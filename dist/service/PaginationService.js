"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationService = void 0;
const DEFAULT_PAGE_SIZE = 0;
const DEFAULT_PAGE_NUMBER = 1;
class PaginationService {
    static getInstance() {
        if (!this.instance) {
            this.instance = new PaginationService();
        }
        return this.instance;
    }
    async getPagination(query) {
        const { pageNumber, pageSize } = query;
        const pn = (Number(pageNumber || DEFAULT_PAGE_NUMBER) - 1);
        const skip = (pn < 0 ? 0 : pn) * Number(pageSize || DEFAULT_PAGE_SIZE);
        return {
            skip,
            limit: pageSize
        };
    }
}
exports.PaginationService = PaginationService;
//# sourceMappingURL=PaginationService.js.map