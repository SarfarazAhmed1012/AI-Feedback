import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, "Message must be atleast 2 charachters")
    .max(300, "Message can not be more than 300 charachters"),
});
