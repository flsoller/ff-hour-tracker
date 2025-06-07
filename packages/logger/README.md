# @hour-tracker/logger

A shared logging package for the Hour Tracker application using [pino](https://github.com/pinojs/pino).

## Installation

This package is part of the Hour Tracker monorepo and can be installed via yarn:

```bash
yarn add @hour-tracker/logger
```

## Usage

### Basic Usage

```typescript
import { logger } from "@hour-tracker/logger";

logger.info("Hello world");
logger.error({ err }, "An error occurred");
```

### Custom Logger Instance

```typescript
import { createLogger } from "@hour-tracker/logger";

const logger = createLogger({
  name: "my-service",
  level: "debug",
  prettyPrint: true,
});

logger.info("Using custom logger");
```

### Configuration

The logger can be configured with the following options:

- `name`: The name of the logger (default: 'hour-tracker')
- `level`: The log level (default: process.env.LOG_LEVEL || 'info')
- `prettyPrint`: Whether to use pretty printing (default: true in non-production)

### Environment Variables

- `LOG_LEVEL`: Set the logging level (trace, debug, info, warn, error, fatal)
- `NODE_ENV`: When set to 'production', disables pretty printing by default

## Log Levels

In order of priority:

1. fatal
2. error
3. warn
4. info
5. debug
6. trace
