import { systemPromt } from "@/components/features/ai/actions/data";
import { tools } from "@/components/features/ai/actions/tools";
import { gemini } from "@/lib/ai/gemini";
import { groq } from "@/lib/ai/groq";
import { openai } from "@/lib/ai/openai";
import { streamText } from "ai";

export async function POST(req: Request) {
    const { messages, model } = await req.json();

    const result = streamText({
        model:
          model === "openai"
            ? openai("gpt-4o")
            : model === "gemini"
              ? gemini("gemini-2.0-flash")
              : groq("llama-3.3-70b-versatile"),
        messages,
        tools: tools,
        maxOutputTokens: 512,
        instructions: systemPromt
      });

    return result.toUIMessageStreamResponse();
}