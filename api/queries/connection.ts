import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../lib/env";
import * as schema from "@db/schema";

let instance: ReturnType<typeof drizzle<typeof schema>>;

export function getDb() {
  if (!env.databaseUrl) {
    throw new Error(
      "DATABASE_URL が設定されていません。有志編集機能を使うにはデータベースの接続設定が必要です。"
    );
  }
  if (!instance) {
    const client = postgres(env.databaseUrl, { prepare: false });
    instance = drizzle(client, { schema });
  }
  return instance;
}
