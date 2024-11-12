import { defineConfig } from "drizzle-kit";
import { CONNECTION_STRING } from "./src/config";

export default defineConfig({
  dialect: "postgresql",
  schema: "../../packages/db/src/schema/*",
  out: "./src/migrations",
  dbCredentials: {
    url: CONNECTION_STRING,
  },
  migrations: {
    table: "migrations",
    schema: "hour_tracker_migrations",
  },
  breakpoints: false,
  schemaFilter: "hour_tracker",
});
