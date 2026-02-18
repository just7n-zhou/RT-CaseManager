import "dotenv/config";
import { pool } from "./db";
import { seed } from "./seed";

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { typeDefs } from "./graphql/schema.problem";
import { resolvers } from "./graphql/resolvers.problem";

const gqlPort = Number(process.env.GQL_PORT ?? 4001);

async function start() {
  // Ensure DB reachable
  await pool.query("select 1");

  // Seed initial data (idempotent)
  await seed();

  // Start GraphQL server (no Express)
  const server = new ApolloServer({ typeDefs, resolvers });

  const { url } = await startStandaloneServer(server, {
    listen: { port: gqlPort },
  });

  console.log(`GraphQL API: ${url}graphql`);
}

start().catch((err) => {
  console.error("Failed to start GraphQL server:", err);
  process.exit(1);
});
