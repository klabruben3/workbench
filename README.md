# Workbench

> **Status: Archived / No longer actively developed**

**Workbench was an experimental developer workspace designed to capture the parts of software development that GitHub, portfolios, and professional profiles usually leave behind.**

The project explored the idea of a private engineering operating system where projects, ideas, technical decisions, bugs, notes, technologies, experiments, patterns, and reflections could exist as connected information rather than isolated records.

Development has stopped, but the repository is public for anyone interested in studying, adapting, or continuing the concept.

---

## The Idea

A developer's actual body of work is much larger than their repositories.

GitHub captures commits and source code.

A portfolio captures selected outcomes.

LinkedIn captures career history.

But much of the engineering process disappears:

* Why was an architecture chosen?
* What alternatives were rejected?
* What bugs changed the direction of a system?
* Which ideas became projects?
* Which projects introduced new technologies?
* What patterns appeared repeatedly?
* What was learned while building?
* How did a project evolve over time?

Workbench was an attempt to preserve that information.

Its original philosophy was:

> **Capture once. Reuse forever.**

Instead of repeatedly recreating the same information for portfolios, project pages, documentation, career history, and personal notes, Workbench aimed to become the underlying source of truth.

---

# Your work, connected.

The core idea behind Workbench was not simply to create another notes application or project manager.

It was to model a developer's work as a connected system.

Conceptually:

```text
                     Developer

                         │
        ┌────────────────┼────────────────┐
        │                │                │
     Projects          Ideas           Notes
        │                │                │
        ├──── Decisions ─┤                │
        │                                 │
        ├──── Bugs ───────── Patterns ────┤
        │                                 │
        └──────── Technologies ───────────┘

                         │
                         ▼

                     Evolution
```

A technology could belong to multiple projects.

A bug could lead to a reusable pattern.

An idea could evolve into a project.

A technical decision could explain why a project's architecture changed.

A notebook entry could later become a more permanent engineering thought.

The value was intended to come from those relationships.

---

## Original Purpose

Workbench began as the **private operating layer behind my developer portfolio**.

The original model was:

```text
             Workbench

          private workspace
                │
                │ manage
                ▼
       structured developer data
                │
                │ publish
                ▼
             Devfolio

          public projection
```

Instead of maintaining portfolio content manually, Workbench would contain the source information and Devfolio would expose selected parts of it publicly.

The concept later expanded into a standalone developer workspace.

---

## Workspace

The planned system covered several areas of a developer's work.

### Projects

Project records were intended to contain more than a title and description.

A project could accumulate:

* Architecture decisions
* Technologies
* Bugs
* Experiments
* Notes
* Milestones
* Ideas
* Patterns
* Development history

Together these would form a project dossier showing not only what was built, but how it evolved.

---

### Ideas

A place to capture product, engineering, and experimental ideas before they become formal projects.

Ideas could eventually:

* Remain exploratory
* Accumulate research
* Connect to technologies
* Become projects
* Be abandoned while preserving the reasoning behind them

---

### Notebook

A lightweight engineering notebook for capturing information while working.

Potential entries included:

* Debugging discoveries
* Architecture notes
* Research
* Code observations
* References
* Experiments
* Lessons learned

Notebook entries were intended to be quick to create and capable of evolving into more permanent knowledge.

---

### Decisions

Engineering decisions and their reasoning.

The goal was to preserve questions such as:

```text
Why Supabase instead of another backend?

Why server components here?

Why was this schema redesigned?

Why was this feature abandoned?
```

The decision itself matters, but so does the context that produced it.

---

### Bugs

Not simply an issue tracker.

Workbench explored bugs as part of engineering history.

A bug could connect to:

* A project
* A technology
* A technical decision
* A pattern
* A lesson
* A later architectural change

---

### Patterns

Reusable engineering knowledge discovered across projects.

Patterns could emerge from repeated solutions, bugs, architectural decisions, or experiments and then become reusable knowledge for future systems.

---

### Technologies

A structured record of technologies used across the developer's work.

Rather than keeping a static skills list, Workbench could derive experience from actual projects and activity.

---

### Evolution

A timeline representing the developer's progression.

Instead of manually maintaining another historical dataset, much of this information could theoretically be derived from projects, technologies, milestones, ideas, and other workspace activity.

---

## Maurice

Workbench also explored an AI assistant called **Maurice**.

Maurice was intended to operate over the developer's own workspace rather than act as a generic chatbot.

At the global level, Maurice could reason across the broader engineering workspace.

Inside a project, Maurice could instead operate with project-specific context.

The eventual idea was something closer to:

```text
Developer
    │
    ▼
 Maurice
    │
    ├── Projects
    ├── Decisions
    ├── Bugs
    ├── Ideas
    ├── Notebook
    ├── Patterns
    └── Technologies
```

This was an early exploration of the tool-using, context-aware assistants that later became a much larger part of my other projects.

---

## Architecture Direction

Workbench was designed as an authenticated administrative application rather than a marketing website.

The intended architecture favored:

* Server Components by default
* Server Actions and forms for mutations
* Minimal unnecessary client-side JavaScript
* Supabase-backed persistence
* PostgreSQL as the underlying data model
* Owner-only authenticated operations
* Connected entities rather than isolated content collections
* AI tools operating over structured workspace data

The interface was intended to feel closer to tools such as an IDE, Linear, GitHub, or an internal engineering dashboard than a public-facing product.

---

## Technology

The project explored a stack including:

* **Next.js**
* **React**
* **TypeScript**
* **Supabase**
* **PostgreSQL**
* **Vercel AI SDK**
* **OpenAI**
* **Gemini**
* **Groq**
* **Lucide**
* **Tailwind CSS**

Different parts of the repository may represent different stages of the experiment, including prototype or mock-data implementations.

---

## Why Development Stopped

Workbench was not abandoned because the underlying ideas were useless.

It was abandoned because its boundaries stopped making sense.

The original purpose was to manage information that would eventually appear on my developer portfolio. As the portfolio itself evolved into a more interactive and manageable system, much of Workbench's functionality could live directly inside **Devfolio**.

Maintaining:

```text
Workbench → data → Devfolio
```

started to become less compelling than allowing Devfolio to manage its own source data:

```text
Devfolio
    │
    ├── Projects
    ├── Ideas
    ├── Technologies
    ├── Thoughts
    ├── Notebook
    └── Derived views
```

At the same time, Workbench as an independent product did not appear to solve a strong enough standalone problem to justify continuing to develop and maintain it separately.

The strongest ideas survived.

They influenced how I think about:

* Structured developer data
* Source data versus derived views
* Context-aware AI
* Project history
* Personal knowledge systems
* Developer portfolios as projections of active work

---

## What Survived

One of Workbench's most important conclusions was:

> **A portfolio becomes more useful when it is a projection of an active workspace rather than a second place where information must be manually maintained.**

That idea eventually influenced the direction of Devfolio.

Instead of maintaining projects, technologies, history, and related information across several disconnected systems, the portfolio itself can increasingly become the management surface for its underlying source data.

Workbench therefore remains useful as an architectural experiment even though the standalone application was discontinued.

---

## Repository Status

This repository is no longer actively maintained.

Expect:

* Incomplete features
* Prototype implementations
* Mock data
* Unfinished architecture
* Abandoned experiments
* Code representing different stages of the concept

There is no guarantee that the current repository represents a production-ready application.

That is intentional.

The repository is being preserved because the ideas, architecture, and partial implementations may still be useful to someone else.

---

## For Developers

You are welcome to:

* Fork the project
* Rework the architecture
* Extract individual ideas
* Turn it into a personal engineering workspace
* Build a developer knowledge system from it
* Connect it to a portfolio
* Expand the graph/relationship model
* Replace Maurice with your own AI system
* Take the project in an entirely different direction

There is no requirement to preserve the original vision.

If something here helps you build something better, the repository has served its purpose.

---

## Running the Project

Install the project dependencies:

```bash
npm install
```

Start the development environment:

```bash
npm run dev
```

Because Workbench went through several experimental stages, additional configuration may be required depending on which parts of the repository are used.

Backend and AI functionality may require services and environment variables associated with Supabase and the configured AI providers.

---

## Possible Directions

If someone wanted to continue the project, some of the more interesting directions would be:

* A graph-based developer knowledge system
* A private engineering journal
* A personal technical knowledge base
* An AI-assisted project history system
* A portfolio CMS backed by structured engineering data
* A developer operating system
* Automated project documentation
* Cross-project pattern discovery
* Semantic search across personal engineering history
* A developer-focused personal knowledge graph

Workbench should be treated as a foundation for experimentation rather than a finished product.

---

## Final Note

Workbench started with a question:

> **What happens to all the useful engineering information that never makes it into a commit, README, portfolio, or résumé?**

This project was one attempt at answering it.

I no longer intend to continue Workbench as a standalone product, but the problem it explored is still interesting.

So rather than leave the project inaccessible in a private repository, it is being released for anyone who might find the code, architecture, or idea useful.
