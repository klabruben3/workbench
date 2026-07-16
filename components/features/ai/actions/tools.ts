import { tool } from "ai";
import { AddUserSchema } from "./schema";
import { insertWorker } from "./helpers";

export const tools = {
  addUser: tool({
    description: "Add user to Supabase",
    inputSchema: AddUserSchema,
    execute: insertWorker,
  }),
};
