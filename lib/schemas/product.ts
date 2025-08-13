import { z } from 'zod'

export const createProductSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  slug: z.string().min(1, 'Slug is required').max(255),
  description: z.string().optional().nullable(),
  price_cents: z.number().int().min(0, 'Price must be positive'),
  currency: z.string().length(3).default('USD'),
  stock: z.number().int().min(0, 'Stock must be non-negative').default(0),
  category_id: z.number().int().optional().nullable(),
  active: z.boolean().default(true),
  images: z.array(z.object({
    url: z.string().url(),
    alt: z.string().optional(),
    position: z.number().int().min(0).default(0),
  })).optional().default([]),
})

export const updateProductSchema = createProductSchema.partial()

export const productQuerySchema = z.object({
  q: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  sort: z.enum(['price_asc', 'price_desc', 'name_asc', 'name_desc', 'created_desc']).optional().nullable(),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(12),
})

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type ProductQuery = z.infer<typeof productQuerySchema>