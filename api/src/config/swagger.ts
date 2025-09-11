// src/config/swagger.ts
import { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Invite Social Media API",
      version: "1.0.0",
      description:
        "A complete social media backend API with authentication, posts, comments, and likes",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
      //   {
      //     url: 'https://your-production-url.com',
      //     description: 'Production server',
      //   },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        // Common response schemas
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Operation successful" },
            data: { type: "object" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error description" },
          },
        },
        // Auth schemas
        RegisterRequest: {
          type: "object",
          required: ["username", "password", "display_name"],
          properties: {
            username: { type: "string", example: "johndoe" },
            password: { type: "string", example: "securepassword123" },
            display_name: { type: "string", example: "John Doe" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: { type: "string", example: "johndoe" },
            password: { type: "string", example: "securepassword123" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Login successful" },
            data: {
              type: "object",
              properties: {
                user: {
                  type: "object",
                  properties: {
                    id: { type: "integer", example: 1 },
                    username: { type: "string", example: "johndoe" },
                    display_name: { type: "string", example: "John Doe" },
                    created_at: { type: "string", format: "date-time" },
                  },
                },
                accessToken: {
                  type: "string",
                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                },
                refreshToken: {
                  type: "string",
                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                },
              },
            },
          },
        },
        // Profile schemas
        Profile: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            username: { type: "string", example: "johndoe" },
            display_name: { type: "string", example: "John Doe" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        // Post schemas
        Post: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            content: { type: "string", example: "This is a sample post!" },
            author: { $ref: "#/components/schemas/Profile" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        // Comment schemas
        Comment: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            content: { type: "string", example: "This is a sample comment!" },
            author: { $ref: "#/components/schemas/Profile" },
            post_id: { type: "integer", example: 1 },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        // Like schemas
        Like: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            author: { $ref: "#/components/schemas/Profile" },
            post_id: { type: "integer", example: 1 },
            created_at: { type: "string", format: "date-time" },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  console.log("📖 Swagger docs available at http://localhost:3000/api-docs");
};

export { options };
