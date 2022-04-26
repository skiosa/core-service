# Skiosa Core-Service
The Skiosa Core Service was build on Node.js with apollo-server-express.

## Requirements
- npm / node.js 16
- PostgreSQL

## Usage
Make sure to configure the database connection in our [config](src/config/app.env) file and install all dependencies with `npm install`.

To inject sample data into the database use `npm run initDB`

To use the core-service you can start the service with `npm run start`

After that GraphQL is reachable under `localhost:8080/graphql`

## Development
We would recommend to use the Devcontainer to start developing. All necessary dependencies are installed and you don´t have to install specific tools.

### Devcontainer
This repository has a Dockerfile and a Docker Compose file. These are Visual Studio Devcontainers.
With the [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension you can connect to the Docker Containers.

### First Steps
After your cloned the repo and started the Devcontainer you should run ``npm install`` to install all npm dependencies.

### Run Tests
#### Unit Tests
To run all unit-tests use ``npm run test``. If you want code coverage you can use the ci-pipeline command which also works locally ``npm run test:ci``.

#### Integration Tests
To run all integration tests use ``npm run newman``. (Make sure the core service is running.)

To run all tests use ``npm run test:all``.

### Lint & Formatting
This repository has a [.eslintrc](.eslintrc.json) file. Run eslint with ``npm run lint``. To Fix the formatting use ``npm run format``.

### Building Production Containers
If you want your changes on production you have to create a pull-request. After a merge to master the pipeline will build a new docker-image based on the [Dockerfile](Dockerfile).
But if you want to build the image your self for local testing purposes run ``docker build -t skiosa-core .`` to build the container and ``docker run -p 80:80 skiosa-core`` to start the container locally.

### Neovim setup
In order to develop outside of dev-containers, start up the db and initialize your environment:
```bash
cd .devcontainer 
docker-compose up -d database
```

## Service Lead
The frontend ``Service-Lead`` is [Tim Horlacher](https://github.com/eintim).
