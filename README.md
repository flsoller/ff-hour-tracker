# Description

This project will be used for tracking and logging different metrics for a german voluntary fire fighter station. This solution replaces an Excel spreadsheet. The requirements are:

- log work hours by category.
- log expenses, deposits and payouts.
- add / remove members.
- get PDF reports for different metrics.

# Technology

The frontend features Angular. The backend uses Node with NestJS and MongoDB.

# Installation

This project uses Docker with Docker-Compose and contains Makefiles with commands for easy start-up. Currently only a dev environment exists:

- Make sure Docker is set up on your system.
- Clone this repository.

Make sure to be in the root of the cloned folder and run:

`make run-dev` - or - `docker-compose -f docker-compose.dev.yml up -d`.

Visit http://localhost:4200/
