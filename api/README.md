# invite API

This is the backend API for the Invite social media application. It provides endpoints for user authentication, post management, comments, and likes. 

The API is built using Node.js with TypeScript, the Express.js framework, and PostgreSQL as the database. It utilizes TypeORM as the Object-Relational Mapper for database interactions. The backend includes comprehensive JWT-based authentication, password hashing with bcrypt, and structured logging with Winston. The API is fully documented with Swagger/OpenAPI and includes a complete test suite with Jest for both unit and integration testing. 

## Features
-   **Secure User Authentication**: User registration and login with JWT access and refresh tokens.
-   **Profile Management**: View, update, and delete user profiles.
-   **Post Management**: Create, read, update, and delete posts.
-   **Comments**: Add, update, and delete comments on posts.
-   **Likes**: Like and unlike posts.
-   **Input Validation & Error Handling**: Robust validation and consistent error responses.
-   **API Documentation**: Interactive API documentation generated with **Swagger/OpenAPI**.
-   **Comprehensive Testing**: Complete test suite using **Jest** for unit and integration tests.
-   **Structured Logging**: Server activity and errors logged using **Winston**.

## How to Run

<!-- TODO -->

## Testing

<!-- TODO -->

## API Documentation / Swagger
The API documentation is available via Swagger. Once the server is running, you can access it at `http://localhost:3000/api-docs`.<br />
You can also export the Swagger documentation to a JSON file using the following command:
```bash
npm run swagger:export
```
This will generate a `swagger.json` file in the root directory.
The exported Swagger JSON file can be used for various purposes, such as generating client SDKs or integrating with other tools that support Swagger/OpenAPI specifications.

## About

This project was made for educational purposes. Feel free to use and modify it as needed.
For any questions or suggestions please open an issue or contact me directly via [my website](https://yxnliu.net).