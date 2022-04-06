# core-service

## Neovim setup

In order to develop outside of dev-containers, start up the db and initialize your environment:
```bash
cd .nvim 
docker-compose up -d
export $(cat .env| xargs)
```
