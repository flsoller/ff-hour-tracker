import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { CONNECTION_STRING } from "../config";

export const queryClient = postgres(CONNECTION_STRING, {
  onnotice: () => false,
});
export const localDb = drizzle(queryClient);
