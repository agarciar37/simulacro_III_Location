export const typeDefs = `#graphql
    type Location {
        id: ID!
        name: String!
        country: String!
        zip_code: String!
        timezone: String!
        overall_aqi: Int!
        temp: Int!
        feels_like: Int!
    }

    type Query {
        getLocation(name: String!): Location
        getLocations(country: String!): [Location!]!
    }

    type Mutation {
        addLocation(zip_code: String!): Location
        deleteLocation(id: ID!): Boolean!
    }
`