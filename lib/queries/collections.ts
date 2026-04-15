export const COLLECTIONS_QUERY = /* GraphQL */ `
  query Collections($first: Int!) {
    collections(first: $first) {
      edges {
        cursor
        node {
          id
          handle
          title
          description
          image { url altText width height }
          products(first: 6) {
            edges {
              cursor
              node {
                id handle title availableForSale
                featuredImage { url altText width height }
                priceRange {
                  minVariantPrice { amount currencyCode }
                  maxVariantPrice { amount currencyCode }
                }
              }
            }
            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
          }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`;
