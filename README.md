# Canecas Node App
Microservices implementation of a Online Mug shop, written in NodeJS and Typescript

### **Uses:**

    * NodeJs v16
    * Typescript
    * Express
    * TypeOrm
    * Postgres Database
    * Morgan (for basic logging upon requests)

### **Some security using:**

    * Helmet (for http headers)
    * JWT validation
    * Bcrypt for passwords encryption

### **Test are using:**

    * Jest
    * Supertest (for api requests)

### **Installation and Running**

    * Install NodeJS v16
    * run npm install
    * make sure you have Postgres database running
    * setup environment variables to access database
        TYPEORM_CONNECTION = postgres
        TYPEORM_HOST = the machine IP where the application will run
        TYPEORM_USERNAME = <database username>
        TYPEORM_PASSWORD = <database password>
        TYPEORM_DATABASE = <database name>
        TYPEORM_PORT = 5432
        TYPEORM_ENTITIES = src/domain/**/*.ts
        TYPEORM_ENTITIES_DIR = src/domain

    * also need to setup the application port
        PORT=<Port number here>

    * finally the secret for JWT validations
        JWT_SECRET = somesecetpasswordforjwt

### Additional installation & running instructions

    * the project can be run using a docker container on both postgres and canecas-service
        * the following instructions pull a postgres image and create database/tables for the application
            * run: docker run --name postgres -e POSTGRES_PASSWORD=<postgres password> -p 5432:5432 -d postgres:9.6.23-alpine
            * run: docker exec -it postgres  psql -U postgres postgres, to access psql CLI
                ```create database canecas;
                create role caneca with password '<the password you defined in TYPEORM_PASSWORD environment variable>';
                ALTER ROLE caneca NOSUPERUSER CREATEDB NOCREATEROLE INHERIT LOGIN;
                GRANT CONNECT ON DATABASE canecas TO caneca;
                grant all privileges on database canecas to caneca;
                \c canecas
                CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
```
            * press CONTROL+D to exit the psql CLI
            * run: docker cp ./simple_create_tables.sql postgres:/tmp/simple_create_tables.sql
            * run: docker exec -u postgres postgres psql canecas -f /tmp/create_tables.sql
        * at this point you should have the database and tables created
        * now create the network for the canecas-service container and the postgres container
            * docker network create canecas-service-network-2
            * docker network connect canecas-service-network-2 postgres
        * now you can finally build the canecas-service docker image
            * run: **docker inspect postgres**, to identify the correct IP to connect the database
            * update your environment variables accondingly
            * run: docker build . --platform <desired target platform> -t <github id>/canecas-service
            * run: docker run -it -p 3000:3000 --name canecas-service franzoia/canecas-service

© Romeu Franzoia Junior / 2022
