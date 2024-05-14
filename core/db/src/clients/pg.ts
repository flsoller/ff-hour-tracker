import { drizzle } from 'drizzle-orm/postgres-js';
import { CONNECTION_STRING } from '../config';
import postgres from 'postgres';

const queryClient = postgres(CONNECTION_STRING);
export const localDb = drizzle(queryClient);
