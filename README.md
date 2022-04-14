# Canecas Node App (MongoDB version)
Microservices implementation of a Online Mug shop, written in NodeJS and Typescript

## **Uses:**

* [NodeJs] (v16)
* [Typescript]
* [Express]
* [Morgan] (for basic logging on requests)
* [Winston] (for application logging)
* [MongoDB]
* [Mongoose]
* [Swagger UI Express] (API Documentation)

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
    - access: ```http://<serverlocation>/api-docs``` to view the documentation


**© Romeu Franzoia Junior / 2022**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)
    
[NodeJS]: <http://nodejs.org>
[TypeScript]: <http://typescriptlang.org/>
[Express]: <http://expressjs.com>
[MongoDB]: <http://mongodb.org/>
[Mongoose]: <http://mongoosejs.com/>
[Morgan]: <http://npmjs.com/package/morgan>
[Winston]: <http://npmjs.com/package/winston>
[Swagger UI Express]: <http://npmjs.com/package/swagger-ui-express>

