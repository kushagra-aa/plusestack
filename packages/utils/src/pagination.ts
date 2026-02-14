// Pagination helper utilities

export interface PaginationOptions {
    page: number;
    limit: number;
}

export interface PaginationResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export function calculatePagination(
    page: number,
    limit: number,
    total: number
) {
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;

    return {
        page,
        limit,
        total,
        totalPages,
        offset,
    };
}

export function createPaginatedResponse<T>(
    data: T[],
    page: number,
    limit: number,
    total: number
): PaginationResult<T> {
    return {
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}
