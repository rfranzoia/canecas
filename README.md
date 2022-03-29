# Canecas Node App (MongoDB version)
Microservices implementation of a Online Mug shop, written in NodeJS and Typescript

## **Uses:**

* NodeJs v16
* Typescript
* Express
* Morgan (for basic logging upon requests)
* MongoDB
* Mongoose
* swagger (API Documentation)

    ### **Some security using:**

  * Helmet (for http headers)
  * JWT validation
  * Bcrypt for passwords encryption

    ### **Test are using:**

  * Jest
  * Supertest (for api requests)

### **Installation and Running**

* install NodeJS v16
* run ```npm install```
* make sure you have a MongoDB installed in you machine or somewhere in the cloud
* set the connection string to your database in an environment variable

    ```MONGO_URL = mongodb+srv://<user>:<password>@<server_url/database>?retryWrites=true&w=majority```

* also need to setup the application port

    ```PORT=<Port number here>```

* finally the secret for JWT validations

    ```JWT_SECRET = somesecetpasswordforjwt```

### Additional installation & running instructions

- the project can be run using a docker container
    - build the canecas-service docker image
    - update your environment variables accondingly
    - run: ```docker build . --platform <desired target platform> -t <github id>/canecas-service```
    - run: ```docker run -it -p 3500:3500 --name canecas-service franzoia/canecas-service```

- API documentation is provided with Swagger
    - access: **http://<server-location>/api-docs** to view the documentation

© Romeu Franzoia Junior / 2022
