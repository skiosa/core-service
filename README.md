# core-service

## Neovim setup

In order to develop outside of dev-containers, start up the db and initialize your environment:
```bash
cd .devcontainer 
docker-compose up -d database
cd ../.nvim 
export $(cat .env| xargs)
```
