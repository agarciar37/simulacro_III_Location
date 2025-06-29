import { MongoClient } from "mongodb";
import { resolvers } from "./resolvers.ts";
import { typeDefs } from "./schema.ts";
import { LocationModel } from "./types.ts";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloServer } from "@apollo/server";

const MONGO_URL = Deno.env.get("MONGO_URL")
if (!MONGO_URL) {
  throw new Error("MONGO_URL is not defined");
}

const mongoClient = new MongoClient(MONGO_URL);
await mongoClient.connect();

console.info("Connected to MongoDB");

const mongoDB = mongoClient.db("Simulacro_III_Locations");
const LocationCollection = mongoDB.collection<LocationModel>("locations");

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  context: async () => ({ LocationCollection }),
});

console.info(`Server ready at ${url}`);