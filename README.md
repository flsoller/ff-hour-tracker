## Description

[![CI](https://github.com/flsoller/ff-hour-tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/flsoller/ff-hour-tracker/actions/workflows/ci.yml)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/flsoller/ff-hour-tracker?label=Release&logo=github&logoColor=silver)

The project [Hour Tracker App](https://hour-tracker.flsoller.dev/login) started through a request from a friend to help him track and log different metrics for voluntary workers or members. This app aims to provide an easy solution for tracking hours and expenses. The requirements are:

- log work hours by category.
- log expenses, deposits and payouts.
- add / remove members.
- get reports for different metrics.
- authentication.

The frontend features Vue. The backend uses Node with Express, Prisma and Postgres. A fully automated CI pipeline is in place powered by GitHub actions for [builds and tests](https://github.com/flsoller/ff-hour-tracker/actions/workflows/ci.yml) as well as a [changelog and release](https://github.com/flsoller/ff-hour-tracker/actions/workflows/release.yml) workflow.

The project is setup as a Monorepo, so all parts of the application are co-located in this repository.

<br>

---

## Installation / Setup

If you want to run the project locally or contribute, please checkout the [contribution guide](CONTRIBUTING.md) for setup and other instructions.

---

## Serverless Architecture Investigation

Since the current API is deployed to a free service, container startup time can take 30 seconds or more. For a side project with next to no traffic, it is not feasible to provision a dedicated instance. As such, it could be an option to leverage AWS Free Tier for optimal performance. Additional Lambda concurrency limits and API Gateway request throttling could serve as a cost protection measure against bad actors:

![architecture](https://github.com/flsoller/ff-hour-tracker/assets/49583212/0b14f072-23da-48f8-bb3e-a0988eb59fbd)
