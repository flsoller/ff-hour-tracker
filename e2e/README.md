## End 2 End Tests

### Description

This is the e2e test suite for the project. Currently there are no deployed preview environments configured for running the tests as part of the PR process. As a result, the tests leverage a container network defined in `docker-compose.ci.yml`. It is planned to have the e2e's running against deployed services in the future.

<br>

### Tests

To run the e2e tests, make sure the containers are up and you have completed all steps described in `CONTRIBUTING.md`. This will not work without having run the migration and seed script. Run the following command from the repository root

```
yarn e2e:test
```
