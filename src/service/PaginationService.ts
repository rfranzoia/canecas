const DEFAULT_PAGE_SIZE = 0;
const DEFAULT_PAGE_NUMBER = 1;

export type Pagination = {
    skip: number;
    limit: number;
}

export class PaginationService {

    async getPagination(query): Promise<Pagination> {
        const { pageNumber, pageSize } = query;
        const pn = (Number(pageNumber || DEFAULT_PAGE_NUMBER) - 1);
        const skip = (pn < 0 ? 0 : pn) * Number(pageSize || DEFAULT_PAGE_SIZE);
        return {
            skip,
            limit: pageSize
        }
    }
}

export const paginationService = new PaginationService();
