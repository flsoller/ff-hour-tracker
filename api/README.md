## API

### Description

This is the web server package for the project.

### Tests

To run api integration tests, make sure the containers are up and running and run the command from the root folder:

```
yarn api:test-ci:integration
```

To run api integration tests outside of the docker containers, ensure you've installed the required dependencies and run the command from the `api` folder:

```
yarn test
```
