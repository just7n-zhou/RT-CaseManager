export async function gql<T>(query: string, variables?: Record<string, any>) {
  const res = await fetch("/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (!res.ok || json.errors) {
    throw new Error(json.errors?.[0]?.message ?? "GraphQL request failed");
  }
  return json.data as T;
}
