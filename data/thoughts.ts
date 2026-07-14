import type { Thought } from "../types";

export const THOUGHTS: Thought[] = [
  {
    id: "1",
    title: "On reaching for Rust when complexity doesn't warrant it",
    preview:
      "I keep choosing Rust for projects where TypeScript would be fine. The ownership model is clarifying, yes — but I'm shipping slower because of it. Need to be deliberate about when systems-level concerns actually require a systems language.",
    related: ["Rust", "Zephyr"],
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    id: "2",
    title: "Tools for myself are better than client work for learning",
    preview:
      "Every time I build something for myself, I'm willing to go deeper — to research the right approach rather than the fast one. Aperture taught me more about Supabase's internals than any client project would have.",
    related: ["Aperture"],
    updatedAt: new Date(Date.now() - 3 * 86400000),
  },
  {
    id: "3",
    preview:
      "The idea backlog is valuable. I keep coming back to old ideas and finding that the right moment has arrived — context I didn't have before makes them feasible now. The act of capturing matters more than the quality of capture.",
    related: [],
    updatedAt: new Date(Date.now() - 7 * 86400000),
  },
  {
    id: "4",
    title: "On public visibility as a forcing function",
    preview:
      "Making Aperture public (even just unlisted on Devfolio) created a different quality bar for the code. Not always a good thing — perfection blocks shipping — but for architecture decisions, knowing it might be read sharpened my thinking.",
    related: ["Aperture", "Devfolio"],
    updatedAt: new Date(Date.now() - 12 * 86400000),
  },
];
