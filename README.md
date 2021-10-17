# Description

This project will be used for tracking and logging different metrics for voluntary workers or members. This app aims to provide an easy solution for tracking hours and expenses. The requirements are:

- log work hours by category.
- log expenses, deposits and payouts.
- add / remove members.
- get reports for different metrics.
- authentication.

# Technology

The frontend features Angular. The backend uses Node with Express and Postgres.

# Installation / Setup

This project uses Docker with Docker-Compose and contains Makefiles with commands for easy start-up. Currently only a dev environment exists:

- Make sure Docker is set up on your system.
- Clone this repository.

<br>

## Docker environment

The following command will download and build the required images and set up a local dev environment with a persistent database volume.

Make sure to be in the root of the cloned folder and run:

```
make create-dev
```

`or`

```
docker-compose -f docker-compose.dev.yml up -d
```

<br>

## Initialize database

When the previous step was successfully, we need to set up the postgres schema by following these steps:

```
cd api/ && npm run db:docker:firstinit
```

DISCLAIMER: During first init, the schema will be force pushed and the database force reset. Because of the early stages of the project, migrations will not be used at this time. See [Prisma docs](https://www.prisma.io/docs/concepts/components/prisma-migrate/db-push#choosing-db-push-or-prisma-migrate) for further details.

<br>

## Visit Project

When all of the above steps were successful:

- Frontend is available at http://localhost:4200/
- API is available at http://localhost:5000/

<br>

## Pause / Start Containers

To pause the containers and resume at a later time run:

```
make stop-dev
---
make start-dev
```

`or`

```
docker-compose -f docker-compose.dev.yml stop
---
docker-compose -f docker-compose.dev.yml start
```

<br>

## Remove Containers

To permanently remove associated images and volumes run the following command from the root directory:

```
make remove-dev
```

`or`

```
docker-compose -f docker-compose.dev.yml down -v --rmi all
```
