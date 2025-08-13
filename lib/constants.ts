
export const APP_NAME = 'NextShop'
export const APP_DESCRIPTION = 'Modern E-Commerce Platform'

export const SHIPPING = {
  STANDARD_RATE_CENTS: 500, // $5.00
  FREE_THRESHOLD_CENTS: 5000, // Free shipping over $50
}

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
}

export const CACHE = {
  DEFAULT_TTL: 60, // seconds
  PRODUCTS_TTL: 300, // 5 minutes
  CATEGORIES_TTL: 600, // 10 minutes
}

export const RATE_LIMIT = {
  DEFAULT_WINDOW: 600, // 10 minutes
  DEFAULT_MAX_REQUESTS: 100,
}

export const CURRENCY = {
  DEFAULT: 'USD',
  SUPPORTED: ['USD', 'EUR', 'GBP', 'CAD'],
}