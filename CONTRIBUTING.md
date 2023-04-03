## Project Setup

<br>

### Prerequisites:

- Docker locally installed on your system
- Git locally installed on your system
- Clone this repository:

  ```
  git clone https://github.com/flsoller/ff-hour-tracker.git
  ```

<br>

### Docker environment

This project uses Docker with Docker-Compose and contains Makefiles with commands for easy start-up. The following command will download and build the required images and set up a local dev environment with a persistent database volume.

Make sure to be in the root of the cloned folder and run:

```
make create-dev
```

`or`

```
docker-compose -f docker-compose.dev.yml up -d
```

<br>

### Dependencies

This repo bundles the required yarn release version for CLI commands. In order to setup your local development environment run from the root folder:

```
yarn install && api:prisma-generate
```

<br>

### Initialize database

When the previous step was successful, we need to run the initial migration to set up the postgres db by running:

```
yarn api:db:dev:migrate
```

Next we can seed the db with some dummy data:

```
yarn api:db:dev:seed
```

<br>

### Visit Project

When all of the above steps were successful:

- Frontend is available at http://localhost:3000/
- API is available at http://localhost:5000/

<br>

---

## Guidelines

### Build and test automation:

Github Action workflows are in place to ensure all build and test steps pass for any given branch intended to be merged to master. A new commit pushed to the repository will trigger the workflow. PRs can not be merged until all checks have passed:

- Building images for API (dev / prod versions) and Frontend
- All tests passing (Unit / Integration / E2E)
- Preview deployment success

<br>

### Pre-commit hook

The release workflow relies on [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) to automatically generate changelogs. All commit messages need to follow the conventions outlined in the link above. Example valid commit messages:

```
// a bugfix commit message
fix: do not create commit for release

// a feature commit message with scope
feat(api): added new route create log entries
```

<br>

### Tests

All added features and bugfixes should be covered by automated tests. Depending on the scope of the solution these can be either unit, integration or end-to-end tests. A general rule of thumb is to avoid writing tests that break when the implementation details of the underlying code changes. Therefore focus should be on integration and E2E tests.

Details on how to run the tests can be found in the Readme of each package.

<br>

---

## Teardown

To permanently remove associated images, volumes and networks run the following command from the root directory:

```
make remove-dev
```

`or`

```
docker-compose -f docker-compose.dev.yml down -v --rmi all
```
