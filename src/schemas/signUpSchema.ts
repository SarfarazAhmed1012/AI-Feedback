import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(2, "Username must be atleast 2 charachrters")
  .max(20, "Username can not be more than 20 charachters")
  .regex(/[a-zA-Z][a-zA-Z0-9-_]{3,32}/gi, "Invalid username");

export const signUpSchema = z.object({
  username: userNameValidation,
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 charachters" }),
});
