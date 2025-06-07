import pino from "pino";

export interface LoggerOptions {
  name?: string;
  level?: string;
  prettyPrint?: boolean;
}

export function createLogger(options: LoggerOptions = {}) {
  const {
    name = "hour-tracker-api",
    level = process.env.LOG_LEVEL || "info",
    prettyPrint = process.env.DEV_OR_INTEGRATION_USE,
  } = options;

  const transport = prettyPrint
    ? {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        },
      }
    : undefined;

  return pino({
    name,
    level,
    ...transport,
  });
}

// Export a default logger instance
export const logger = createLogger();

// Re-export pino types for convenience
export type Logger = pino.Logger;
export type LogFn = pino.LogFn;
