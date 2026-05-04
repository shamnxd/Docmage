import { z } from 'zod';

export const extractPagesSchema = z.object({
  body: z.object({
    pageIndices: z.array(z.number().int().nonnegative()).min(1, 'At least one page must be specified'),
  }),
});
