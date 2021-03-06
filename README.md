## Description

API with Nestjs


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Migrations

```bash
# create a database and define in the .env file the data indicated. 
$ DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASENAME?schema=public"

# run migratons
$ npx prisma migrate dev

# run seeders
$ npx prisma db seed
```

## Swagger



```bash
# First run the application with
$ npm run start:dev

# Then go to the browser to the address localhost:3000/api

```
![alt text](https://github.com/joanscure/Ravn-Challenge-V2-joanleyton/blob/main/docs/swagger.png?raw=true)
