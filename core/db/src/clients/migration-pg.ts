import { CONNECTION_STRING } from '../config';
import postgres from 'postgres';

export const migrationClient = postgres(CONNECTION_STRING, { max: 1 });
