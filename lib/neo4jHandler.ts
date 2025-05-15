import neo4j, { Driver } from "neo4j-driver";

let driver: Driver;

export async function initDriver() {
  if (!process.env.NEO4J_URI || !process.env.NEO4J_USER || !process.env.NEO4J_PWD) {
    throw new Error("NEO4J_URI, NEO4J_USER, and NEO4J_PWD must be set");
  }

  driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PWD)
  );

  // Verify connectivity
  const serverInfo = await driver.getServerInfo();
  console.log("Neo4j connected: ", serverInfo);

  return driver;
}