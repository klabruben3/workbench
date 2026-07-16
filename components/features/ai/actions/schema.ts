import { z } from "zod";

const AddUserSchema = z.object({
  name: z.string(),
});

type AddUserInputProp = z.infer<typeof AddUserSchema>;

export { AddUserSchema, type AddUserInputProp };
