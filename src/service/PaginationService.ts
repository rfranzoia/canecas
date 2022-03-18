
const DEFAULT_PAGE_SIZE = 0;
const DEFAULT_PAGE_NUMBER = 1;

export type pagination = {
    skip: number;
    limit: number;
}

export class PaginationService {

    static instance: PaginationService;

    static getInstance(): PaginationService {
        if (!this.instance) {
            this.instance = new PaginationService();
        }
        return this.instance;
    }

    async getPagination(query): Promise<pagination> {
        const {pageNumber, pageSize} = query;
        const pn = (Number(pageNumber || DEFAULT_PAGE_NUMBER) - 1);
        const skip = (pn < 0? 0: pn) * Number(pageSize || DEFAULT_PAGE_SIZE);
        return {
            skip,
            limit: pageSize
        }
    }
}