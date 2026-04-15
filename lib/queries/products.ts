import { PRODUCT_FRAGMENT } from "./fragments";

export const PRODUCTS_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query Products($first: Int!, $after: String, $query: String) {
    products(first: $first, after: $after, query: $query) {
      edges {
        cursor
        node { ...ProductFields }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
`;

export const ALL_PRODUCT_HANDLES_QUERY = /* GraphQL */ `
  query AllProductHandles($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node { handle }
        cursor
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`;
