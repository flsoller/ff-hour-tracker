# Description

[![Docker Image CI](https://github.com/flsoller/ff-hour-tracker/actions/workflows/docker-image.yml/badge.svg)](https://github.com/flsoller/ff-hour-tracker/actions/workflows/docker-image.yml) [![Tests](https://github.com/flsoller/ff-hour-tracker/actions/workflows/tests.yml/badge.svg)](https://github.com/flsoller/ff-hour-tracker/actions/workflows/tests.yml)

This project started through a request from a friend to help him track and log different metrics for voluntary workers or members. This app aims to provide an easy solution for tracking hours and expenses. The requirements are:

- log work hours by category.
- log expenses, deposits and payouts.
- add / remove members.
- get reports for different metrics.
- authentication.

# Technology

The frontend features Vue. The backend uses Node with Express, Prisma and Postgres.

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

When the previous step was successful, we need to run the initial migration to set up the postgres db by running:

```
yarn api:db:dev:migrate
```

Next we can seed the db with some dummy data:

```
yarn api:db:dev:seed
```

<br>

## Visit Project

When all of the above steps were successful:

- Frontend is available at http://localhost:3000/
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

## Tests

### API

To run api integration tests, make sure the containers are up and running and run the command from the root folder:

```
yarn api:test-ci:integration
```

### Frontend

To run frontend tests, make sure the containers are up and running and run the command from the root folder:

```
yarn frontend:test
```

<br>

## Local development

This repo includes the required yarn release for CLI commands. In order to setup you local development environment and get access to autocomplete in your IDE run from the root folder:

```
yarn install && api:prisma-generate
```

<br>

## Remove Containers

To permanently remove associated images, volumes and networks run the following command from the root directory:

```
make remove-dev
```

`or`

```
docker-compose -f docker-compose.dev.yml down -v --rmi all
```
