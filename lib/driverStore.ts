import { Driver } from 'neo4j-driver';
import { initDriver } from './neo4jHandler';

// This module maintains a singleton instance of the Neo4j driver
let globalDriver: Driver | null = null;

export async function getDriver(): Promise<Driver> {
  if (!globalDriver) {
    console.log("Initializing new Neo4j driver instance");
    globalDriver = await initDriver();
    
    // Set up cleanup on process termination
    process.on('beforeExit', async () => {
      if (globalDriver) {
        await globalDriver.close();
        globalDriver = null;
        console.log("Neo4j driver closed on process exit");
      }
    });
  }
  
  return globalDriver;
}

// For testing or manual cleanup
export async function closeDriver(): Promise<void> {
  if (globalDriver) {
    await globalDriver.close();
    globalDriver = null;
    console.log("Neo4j driver manually closed");
  }
} 