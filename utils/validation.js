const { z } = require("zod");
const { defaultUserProfilePhoto } = require("./constants");

const userSchemaZod = z.object({
    firstName: z.string()
        .min(4, "First name must be at least 4 characters").
        max(10, "First name must be at most 10 characters"),

    lastName: z.string()
        .min(2, "Last name must be at least 2 characters")
        .max(10, "Last name must be at most 10 characters"),

    emailId: z.string()
        .email("Invalid email format"),

    password: z.string()
        .min(8, "Password must be at least 8 characters long"),

    age: z.number()
        .min(18, "Age must be at least 18")
        .max(100, "Age must be at most 100"),

    gender: z.enum(["male", "female", "other"],
        { required_error: "Gender is required" }),

    photoUrl: z.string()
        .url()
        .optional()
        .default(defaultUserProfilePhoto),

    about: z.string().optional(),

    skills: z.array(z.string()).optional(),
});

module.exports = userSchemaZod;