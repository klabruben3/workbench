import { supabase } from "@/lib/supabase/client";
import { AddUserInputProp } from "./schema";

export async function insertWorker({ name }: AddUserInputProp) {
  await supabase.from("workers").insert({
    name,
  });
}
