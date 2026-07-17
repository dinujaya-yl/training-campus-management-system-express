import { z } from 'zod';

export const CreateUserSchema = {
    body: z.object({
        email: z.string().email().trim().toLowerCase(),
        name: z.string().min(1).trim(),
        password: z.string().min(8),
        confirmPassword: z.string().min(8)
    }).strict()
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match!",
        path: ['confirmPassword']
    })
    .transform(({confirmPassword, ...rest}) => rest),
    // query: z.object({}).strict(),
    // params: z.object({}).strict()
};

export type CreateUserInput = z.infer<typeof CreateUserSchema.body>