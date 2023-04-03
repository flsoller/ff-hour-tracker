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
