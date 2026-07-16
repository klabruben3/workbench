"use server";

import { generateText, ModelMessage } from "ai";

import { gemini } from "@/lib/ai/gemini";
import { openai } from "@/lib/ai/openai";
import { groq } from "@/lib/ai/groq";

import { tools } from "./tools";
import { systemPromt } from "./data";

type Model = "gemini" | "openai" | "grod";

export async function askAI(messages: ModelMessage[], name: Model) {
  const { text, toolResults } = await generateText({
    model:
      name === "openai"
        ? openai("gpt-4o")
        : name === "gemini"
          ? gemini("gemini-2.0-flash")
          : groq("llama-3.3-70b-versatile"),
    messages,
    tools: tools,
    maxOutputTokens: 512,
    instructions: systemPromt
  });
  

  return { text, toolResults };
}
