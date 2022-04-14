# core-service

## Usage
To inject data into the database use `npm run initDB`
To use the core-service you can start the service with `npm run start`
After that GraphQL is reachable under `localhost:8080/graphql`

## Neovim setup

In order to develop outside of dev-containers, start up the db and initialize your environment:
```bash
cd .devcontainer 
docker-compose up -d database
```
