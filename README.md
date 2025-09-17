# invite

<!-- TODO -->

## Docker

Dockerfiles for both the backend and frontend are provided.
I have also included a `docker-compose.yml` file to orchestrate both services.
Make sure to create a `.env` file in the root directory with the necessary environment variables before running `docker-compose up --build`.

> [!IMPORTANT]
> You must have a running postgreSQL instance for the backend to connect to.
> I have provided a quickstart docker command to run a PostgreSQL container in ``backend/README.md``.

> [!NOTE]
> The needed variables for the docker-compose setup are:
> - `DATABASE_URL`
> - `DATABASE_PORT` 
> - `DATABASE_NAME`
> - `DATABASE_USER`
> - `DATABASE_PASSWORD`
> - `JWT_SECRET`
> - `JWT_REFRESH_SECRET`
> - `VITE_API_URL`
> - `FRONTEND_PORT`
> - `BACKEND_PORT`