# Canecas Node App
Microservices implementation of a Online Mug shop, written in NodeJS and Typescript

### **Uses:**

    + NodeJs v16
    + Typescript
    + Express
    + TypeOrm
    + Postgres Database
    + Morgan (for basic logging upon requests)

### **Some security using:**

    + Helmet (for http headers)
    + JWT validation
    + Bcrypt for passwords encryption

### **Test are using:**

    + Jest
    + Supertest (for api requests)

### **Installation and Running**

    + Install NodeJS v16
    + run npm install
    + make sure you have Postgres database running
    + setup environment variables to access database
        TYPEORM_CONNECTION = postgres
        TYPEORM_HOST = the machine IP where the application will run
        TYPEORM_USERNAME = <database username>
        TYPEORM_PASSWORD = <database password>
        TYPEORM_DATABASE = <database name>
        TYPEORM_PORT = 5432
        TYPEORM_ENTITIES = src/domain/**/*.ts
        TYPEORM_ENTITIES_DIR = src/domain

    + also need to setup the application port
        PORT=<Port number here>

    + finally the secret for JWT validations
        JWT_SECRET = somesecetpasswordforjwt

© Romeu Franzoia Junior / 2022