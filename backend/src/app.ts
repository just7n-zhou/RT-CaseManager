import "dotenv/config";
import { pool } from "./db";
import { seed } from "./seed";

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { typeDefs } from "./graphql/schema.solution";
import { resolvers } from "./graphql/resolvers.solution";
import { createLoaders } from "./graphql/loaders";

const gqlPort = Number(process.env.GQL_PORT ?? 4001);

async function start() {
  await pool.query("select 1");
  await seed();

  const server = new ApolloServer<{
    loaders: ReturnType<typeof createLoaders>;
  }>({ typeDefs, resolvers });

  const { url } = await startStandaloneServer(server, {
    listen: { port: gqlPort },
    context: async () => ({ loaders: createLoaders() }),
  });

  console.log(`GraphQL API: ${url}graphql`);
}

start().catch((err) => {
  console.error("Failed to start GraphQL server:", err);
  process.exit(1);
});
