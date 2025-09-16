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

1. Clone the repository:
    ```bash
    git clone https://github.com/YonLiud/invite.git
    ```
2. Navigate to the `backend` directory:
    ```bash
    cd invite/backend
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Set up environment variables:
    Create a `.env` file in the `backend` directory and add the following variables:
    ```env
    NODE_ENV=
    DB_HOST=
    DB_PORT=
    DB_USERNAME=
    DB_PASSWORD=
    DB_NAME=
    JWT_SECRET=
    ```
5. Initialize the database:
    Ensure you have PostgreSQL installed and running. Create a database with the name specified in your `.env` file.
6. Run the server:
    ```bash
    npm run dev
    ```
> [!NOTE]
> To run the PostgreSQL database using Docker, you can use the following command:
> ```bash
> docker run --name invite-db POSTGRES_USER=your_username -e POSTGRES_PASSWORD=your_password -e POSTGRES_DB=invite_db -p 5432:5432 -d postgres:15
> ```

The server will start on `http://localhost:3000` as default.

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