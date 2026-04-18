export const CUSTOMER_QUERY = `
  query getCustomer {
    customer {
      id
      firstName
      lastName
      emailAddress {
        email
      }
      phoneNumber {
        phoneNumber
      }
      defaultAddress {
        address1
        address2
        city
        province
        zip
        country
      }
      orders(first: 5, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            name
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice {
              amount
              currencyCode
            }
            lineItems(first: 2) {
              edges {
                node {
                  title
                  quantity
                }
              }
            }
          }
        }
      }
    }
  }
`;
