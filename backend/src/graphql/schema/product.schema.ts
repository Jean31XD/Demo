export const productTypeDefs = /* GraphQL */ `
  type Product {
    id: ID!
    name: String!
    slug: String!
    description: String
    price: Float!
    compareAtPrice: Float
    sku: String
    brand: String
    images: [ProductImage!]!
    attributes: [ProductAttribute!]!
    inventory: ProductInventory!
    category: Category!
    relatedProducts: [Product!]!
    createdAt: String!
    updatedAt: String!
  }

  type ProductImage {
    url: String!
    alt: String!
  }

  type ProductAttribute {
    name: String!
    value: String!
  }

  type ProductInventory {
    available: Boolean!
    quantity: Int!
  }

  type Category {
    id: ID!
    name: String!
    slug: String!
    productCount: Int
  }

  type Pagination {
    total: Int!
    page: Int!
    pageSize: Int!
    hasNextPage: Boolean!
  }

  type ProductsResult {
    items: [Product!]!
    pagination: Pagination!
  }

  enum ProductSort {
    newest
    oldest
    price_asc
    price_desc
  }

  input ProductFilters {
    categoryId: ID
    brand: String
    search: String
    minPrice: Float
    maxPrice: Float
    inStock: Boolean
    sort: ProductSort
  }

  extend type Query {
    products(filters: ProductFilters, page: Int, pageSize: Int): ProductsResult!
    productBySlug(slug: String!): Product
    productById(id: ID!): Product
    categories: [Category!]!
  }

  input ProductImageInput {
    url: String!
    alt: String!
  }

  input ProductAttributeInput {
    name: String!
    value: String!
  }

  input ProductInventoryInput {
    quantity: Int!
  }

  input CreateProductInput {
    name: String!
    slug: String!
    description: String
    price: Float!
    compareAtPrice: Float
    sku: String
    brand: String
    categoryId: ID!
    images: [ProductImageInput!]!
    attributes: [ProductAttributeInput!]!
    inventory: ProductInventoryInput!
  }

  input UpdateProductInput {
    name: String
    slug: String
    description: String
    price: Float
    compareAtPrice: Float
    sku: String
    brand: String
    categoryId: ID
    images: [ProductImageInput!]
    attributes: [ProductAttributeInput!]
    inventory: ProductInventoryInput
  }

  extend type Mutation {
    createProduct(input: CreateProductInput!): Product!
    updateProduct(id: ID!, input: UpdateProductInput!): Product!
    deleteProduct(id: ID!): Boolean!
  }
`;
