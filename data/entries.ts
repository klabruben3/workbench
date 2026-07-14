import type { NEntry } from "../types";

export const ENTRIES: NEntry[] = [
  {
    id: "1",
    title: "Debugging Supabase RLS policies on Aperture",
    preview:
      "Spent two hours chasing a 401 that turned out to be a missing auth.uid() check in the RLS policy for the media table. The gotcha: USING and WITH CHECK behave differently for SELECT vs INSERT...",
    linkedProject: "Aperture",
    createdAt: new Date(Date.now() - 3 * 3600000),
  },
  {
    id: "2",
    title: "TypeScript 5.5 — inferred type predicates",
    preview:
      "The new inferred type predicates feature is genuinely good. No more writing x is SomeType manually when the function body already makes it obvious. Tested against Aperture...",
    linkedTech: "TypeScript",
    createdAt: new Date(Date.now() - 8 * 3600000),
  },
  {
    id: "3",
    title: "WebRTC signaling server design options",
    preview:
      "Comparing mesh vs. SFU vs. MCU for Tessera. For fewer than 10 participants, a simple mesh via signaling server is probably right to start. MCU is overkill.",
    linkedProject: "Tessera",
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: "4",
    preview:
      "Rust's ownership model is finally clicking after the Zephyr work. Key insight: a &mut T borrow is exclusive — no other reference can exist simultaneously. That's exactly what makes the compiler your concurrency checker.",
    linkedProject: "Zephyr",
    createdAt: new Date(Date.now() - 2 * 86400000),
  },
  {
    id: "5",
    title: "Nomic Embed first impressions",
    preview:
      "Ran Nomic Embed locally on the Aperture source tree. 350ms for an 80-file codebase on M3 Pro — totally acceptable. The semantic similarity scores are surprisingly coherent.",
    createdAt: new Date(Date.now() - 4 * 86400000),
  },
];
