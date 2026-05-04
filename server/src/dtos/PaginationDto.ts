import { z } from 'zod';

export const paginationSchema = z.object({
  query: z.object({
    page: z.preprocess((val) => Number(val) || 1, z.number().default(1)),
    limit: z.preprocess((val) => Number(val) || 10, z.number().default(10)),
    search: z.string().optional(),
    sortBy: z.string().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  }),
});

export type PaginationQuery = z.infer<typeof paginationSchema>['query'];
