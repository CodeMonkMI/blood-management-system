import config from "config";
import "dotenv/config";
import {
  drizzle,
  NodePgClient,
  NodePgDatabase,
} from "drizzle-orm/node-postgres";
import * as schema from "../request/request.entities";

export const db = drizzle(config.get("database_url") as string, { schema });
export type DatabaseClient = NodePgDatabase<typeof schema> & {
  $client: NodePgClient;
};
