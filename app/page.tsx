"use client";
import { useState, useEffect } from "react";
import type { Module } from "../types";
import {
  CommandPalette,
  DashboardModule,
  EvolutionModule,
  GraphModule,
  IdeasModule,
  NotebookModule,
  ProjectsModule,
  SettingsModule,
  TechnologiesModule,
  ThoughtsModule,
} from "@/components/features";
import { Sidebar, TopBar } from "@/components/layout";

export default function App() {
  const [module, setModule] = useState<Module>("dashboard");
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const renderModule = () => {
    switch (module) {
      case "dashboard":
        return <DashboardModule />;
      case "projects":
        return <ProjectsModule />;
      case "ideas":
        return <IdeasModule />;
      case "notebook":
        return <NotebookModule />;
      case "technologies":
        return <TechnologiesModule />;
      case "evolution":
        return <EvolutionModule />;
      case "thoughts":
        return <ThoughtsModule />;
      case "graph":
        return <GraphModule />;
      case "settings":
        return <SettingsModule />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar
        active={module}
        onNavigate={setModule}
        onPaletteOpen={() => setPaletteOpen(true)}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar module={module} />
        <main
          className={`flex-1 overflow-y-auto ${module === "graph" ? "flex flex-col" : ""}`}
        >
          {renderModule()}
        </main>
      </div>
      {paletteOpen && (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          onNavigate={setModule}
        />
      )}
    </div>
  );
}
