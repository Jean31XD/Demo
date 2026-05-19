export const authTypeDefs = /* GraphQL */ `
  type Customer {
    id: ID!
    email: String!
    name: String!
    phone: String
    orders: [Order!]!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    customer: Customer!
  }

  input RegisterInput {
    email: String!
    name: String!
    password: String!
  }

  extend type Query {
    me: Customer
  }

  extend type Mutation {
    login(email: String!, password: String!): AuthPayload!
    register(input: RegisterInput!): AuthPayload!
  }
`;
