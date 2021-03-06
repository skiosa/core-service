FROM node:16.14-alpine
COPY src/ /opt/core-service/src
COPY package.json /opt/core-service/
COPY package-lock.json /opt/core-service/
COPY tsconfig.json /opt/core-service/

WORKDIR /opt/core-service
RUN npm install
ENV NODE_ENV=production

CMD [ "npm", "run", "start" ]