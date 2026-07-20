import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Cash For Trash API",
      version: "1.0.0",
      description: "API Documentation for Cash For Trash Backend",
    },

    servers: [
      {
        url: "http://localhost:3000",
      },
    ],

    tags: [
    {
        name: "Authentication",
        description: "Authentication APIs",
    },
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

        RegisterRequest: {
          type: "object",

          required: [
            "first_name",
            "last_name",
            "email",
            "password",
            "confirm_password",
            "role",
          ],

          properties: {
            first_name: {
              type: "string",
              example: "Rana",
            },

            last_name: {
              type: "string",
              example: "Ahmed",
            },

            email: {
              type: "string",
              example: "rana@test.com",
            },

            password: {
              type: "string",
              example: "Rana1234",
            },

            confirm_password: {
              type: "string",
              example: "Rana1234",
            },

            mobile: {
              type: "string",
              example: "01012345678",
            },

            role: {
              type: "string",
              enum: ["customer", "worker"],
              example: "customer",
            },
          },
        },

        VerifyOTPRequest: {
          type: "object",

          required: ["email", "otp"],

          properties: {
            email: {
              type: "string",
              example: "rana@test.com",
            },

            otp: {
              type: "string",
              example: "123456",
            },
          },
        },

        ResendOTPRequest: {
          type: "object",

          required: ["email"],

          properties: {
            email: {
              type: "string",
              example: "rana@test.com",
            },
          },
        },

        LoginRequest: {
        type: "object",

        required: [
            "email",
            "password"
        ],

        properties: {

            email: {
            type: "string",
            example: "rana@test.com"
            },

            password: {
            type: "string",
            example: "Rana1234"
            }

        }

        },

     
        ForgotPasswordRequest: {
            type: "object",

            required: ["email"],

            properties: {
                email: {
                type: "string",
                example: "rana@test.com",
                },
            },
            },
 
            VerifyResetPasswordOTPRequest: {
                type: "object",

                required: [
                    "email",
                    "otp",
                ],

                properties: {
                    email: {
                    type: "string",
                    example: "rana@test.com",
                    },

                    otp: {
                    type: "string",
                    example: "123456",
                    },
                },
                },
 
                ResetPasswordRequest: {

                type: "object",

                required: [

                    "email",

                    "otp",

                    "new_password",

                    "confirm_password",

                ],

                properties: {

                    email: {

                    type: "string",

                    example: "rana@test.com",

                    },

                    otp: {

                    type: "string",

                    example: "123456",

                    },

                    new_password: {

                    type: "string",

                    example: "Rana1234",

                    },

                    confirm_password: {

                    type: "string",

                    example: "Rana1234",

                    },

                },

                },

                User: {

                    type: "object",

                    properties: {

                        user_id: {

                        type: "string",

                        example: "cmrabc123",

                        },

                        first_name: {

                        type: "string",

                        example: "Rana",

                        },

                        last_name: {

                        type: "string",

                        example: "Ahmed",

                        },

                        email: {

                        type: "string",

                        example: "rana@test.com",

                        },

                        role: {

                        type: "string",

                        example: "customer",

                        },

                        is_verified: {

                        type: "boolean",

                        example: true,

                        },
                    },
                    },
               UserProfile: {
  type: "object",

  properties: {
    user_id: {
      type: "string",
      example: "cmf4k9m5n0000abc123xyz",
    },

    first_name: {
      type: "string",
      example: "Omnia",
    },

    last_name: {
      type: "string",
      example: "Abdelnasser",
    },

    email: {
      type: "string",
      example: "omnia@gmail.com",
    },

    telephone: {
      type: "string",
      example: "01012345678",
    },

    image: {
      type: "string",
      example: "https://example.com/profile.jpg",
    },

    role: {
      type: "string",
      enum: ["customer", "worker", "admin"],
      example: "customer",
    },

    points: {
      type: "number",
      example: 250,
    },

    is_verified: {
      type: "boolean",
      example: true,
    },

    created_at: {
      type: "string",
      format: "date-time",
      example: "2026-07-11T10:30:00Z",
    },

    updated_at: {
      type: "string",
      format: "date-time",
      example: "2026-07-11T11:15:00Z",
    },
  },
},

UserUpdateRequest: {
  type: "object",

  properties: {
    first_name: {
      type: "string",
      example: "Omnia",
    },

    last_name: {
      type: "string",
      example: "Abdelnasser",
    },

    mobile: {
      type: "string",
      example: "01012345678",
    },

    image: {
      type: "string",
      example: "https://example.com/profile.jpg",
    },
  },
},

ChangePasswordRequest: {
  type: "object",

  required: [
    "oldPassword",
    "newPassword",
    "confirmPassword",
  ],

  properties: {
    oldPassword: {
      type: "string",
      example: "OldPassword123",
    },

    newPassword: {
      type: "string",
      example: "NewPassword123",
    },

    confirmPassword: {
      type: "string",
      example: "NewPassword123",
    },
  },
},

                       SuccessResponse: {
                        type: "object",

                        properties: {
                            success: {
                            type: "boolean",
                            example: true,
                            },

                            statusCode: {
                            type: "integer",
                            example: 200,
                            },

                            message: {
                            type: "string",
                            example: "Success",
                            },

                            data: {
                            type: "object",
                            },
                        },
                        },

                        ErrorResponse: {
                        type: "object",

                        properties: {
                            success: {
                            type: "boolean",
                            example: false,
                            },

                            statusCode: {
                            type: "integer",
                            example: 400,
                            },

                            message: {
                            type: "string",
                            example: "Validation failed",
                            },

                            errors: {
                            type: "array",
                            items: {
                                type: "object",
                            },
                            },
                        },
                        },


      },
    },
  },

  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };