import type { ContextType } from "../types";
import { PROJECTS, IDEAS, ENTRIES, TECHNOLOGIES, THOUGHTS } from "../data/mockData";
import { MASTERY_LABEL } from "./constants";

export function getMauricePrimer(type: ContextType, id: string): string {
  if (type === "project") {
    const p = PROJECTS.find((x) => x.id === id);
    if (!p) return "This project is in context.";
    const linked = ENTRIES.filter((e) => e.linkedProject === p.name).length;
    return `I've loaded **${p.name}** into context. Status: ${p.status}. Technologies: ${p.technologies.join(", ") || "none yet"}. ${linked} linked notebook ${linked === 1 ? "entry" : "entries"}. What would you like to work through?`;
  }
  if (type === "idea") {
    const idea = IDEAS.find((x) => x.id === id);
    if (!idea) return "This idea is in context.";
    return `This idea is ready to discuss. Confidence ${idea.confidence}/5 · Importance ${idea.importance}/5.${idea.nextStep ? ` Next step: ${idea.nextStep}` : ""} Ask me anything about it.`;
  }
  if (type === "notebook") {
    const e = ENTRIES.find((x) => x.id === id);
    if (!e) return "This notebook entry is in context.";
    const link = e.linkedProject
      ? `Linked to project: ${e.linkedProject}.`
      : e.linkedTech
        ? `Linked to: ${e.linkedTech}.`
        : "";
    return `This notebook entry is loaded. ${link} I can help you expand it, connect it to other work, or find related ideas.`;
  }
  if (type === "tech") {
    const t = TECHNOLOGIES.find((x) => x.id === id);
    if (!t) return "This technology is in context.";
    return `${t.name} is loaded — ${MASTERY_LABEL[t.mastery]} level, across ${t.projectCount} ${t.projectCount === 1 ? "project" : "projects"}, ${t.entryCount} notebook ${t.entryCount === 1 ? "entry" : "entries"}. What do you want to explore?`;
  }
  if (type === "thought") {
    const t = THOUGHTS.find((x) => x.id === id);
    if (!t) return "This reflection is in context.";
    return `This reflection is loaded.${t.related.length ? ` Related to: ${t.related.join(", ")}.` : ""} I can help you examine it further, challenge assumptions, or connect it to your active work.`;
  }
  return "Context loaded.";
}

export const WORKSPACE_PRIMER = `The entire workspace is available — ${PROJECTS.length} projects, ${IDEAS.length} ideas, ${ENTRIES.length} notebook entries, ${TECHNOLOGIES.length} technologies, ${THOUGHTS.length} thoughts. What are you thinking about?`;

export function getMauriceResponse(
  type: ContextType | "workspace",
  userMsg: string,
): string {
  const msg = userMsg.toLowerCase();
  if (msg.includes("block") || msg.includes("stuck")) {
    return "Let's unpack the blocker. What specifically is preventing forward movement — is it a technical constraint, a decision you're postponing, or something else entirely?";
  }
  if (msg.includes("next") || msg.includes("should i")) {
    return "Based on what's in context, the most immediate leverage point seems to be the next action already defined. But tell me — is there something making that feel uncertain or wrong?";
  }
  if (msg.includes("idea") || msg.includes("think")) {
    return "That's an interesting thread to pull. The pattern I notice across your workspace is a preference for building tools that solve your own problems first. Does this align with that?";
  }
  if (type === "project") {
    return "Looking at this project's history and linked entries, there's a consistent theme. What aspect feels most uncertain right now — the technical approach, or the scope?";
  }
  if (type === "tech") {
    return "Your notebook entries around this technology show genuine depth forming. The gap between Comfortable and Proficient usually closes through deliberate projects, not just usage. Want to identify one?";
  }
  if (type === "thought") {
    return "This kind of reflection tends to be more valuable when tested against a specific case. Can you point to a moment in the last two weeks where this played out?";
  }
  return "I'm following your thinking. Can you say more — what's the piece you're trying to resolve?";
}
