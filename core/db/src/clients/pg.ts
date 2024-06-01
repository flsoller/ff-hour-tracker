import { drizzle } from 'drizzle-orm/postgres-js';
import { CONNECTION_STRING } from '../config';
import postgres from 'postgres';

export const queryClient = postgres(CONNECTION_STRING, {
  onnotice: () => false,
});
export const localDb = drizzle(queryClient);
