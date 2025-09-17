# Invite Frontend

A React + TypeScript + Vite frontend for invite.

## Features

- Built with React 18 and TypeScript
- Vite for fast development and building
- SCSS modules for styling
- JWT-based authentication
- Responsive design
- Post creation, commenting, and liking functionality

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with:
   ```env
   VITE_API_URL=http://localhost:3001
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Docker

You can run the frontend using Docker. Make sure to provide the required environment variable:

### Build the Docker image:
```bash
docker build \
  --build-arg VITE_API_URL=http://localhost:3001 \
  -t invite-frontend .
```

### Run the container:
```bash
docker run -p 3000:80 invite-frontend
```

The application will be available at `http://localhost:3000`.

> [!NOTE]
> The `VITE_API_URL` environment variable is required. The build will fail if not provided.

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.