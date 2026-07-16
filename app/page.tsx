"use client";

import { useState, useCallback, useEffect } from "react";
import { Menu, Search } from "lucide-react";

import type {
  Module,
  AppMode,
  ContextPayload,
  ChatMessage,
  ContextType,
} from "@/types";
import { uid } from "@/lib/helpers";
import {
  getMauricePrimer,
  getMauriceResponse,
  WORKSPACE_PRIMER,
} from "@/lib/aiResponse";

import { Sidebar, FloatingBackground } from "@/components/layout";

import { AuthModal, CommandPalette } from "@/components/ui";

import {
  WorkspaceConversation,
  ContextConversation,
} from "@/components/features/ai";

import {
  DashboardModule,
  ProjectsModule,
  IdeasModule,
  NotebookModule,
  TechnologiesModule,
  EvolutionModule,
  ThoughtsModule,
  GraphModule,
  SettingsModule,
} from "@/components/features";
import { askAI } from "@/components/features/ai/actions/chat";
import { ModelMessage, ToolCallPart, ToolResultPart } from "ai";
import { checkName, createSystemPrompt } from "@/components/features/ai/actions/data";

export default function App() {
  const [module, setModule] = useState<Module>("dashboard");
  const [appMode, setAppMode] = useState<AppMode>("module");
  const [context, setContext] = useState<ContextPayload | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isGuest, setIsGuest] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

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

  const simulateResponse = async (
    contextType: ContextType | "workspace",
    nextMessages: ChatMessage[],
  ) => {
    setTyping(true);
    const userName = await checkName();
    const prompt = createSystemPrompt({name: userName});

    try {
      const primaryResponse = await askAI(
        nextMessages.map(({ role, content }) => ({
          role,
          content,
        })) as ModelMessage[],
        "groq",
        prompt
      );

      if (!primaryResponse.text) {
        const toolResult: ToolResultPart = {
          type: "tool-result",
          toolCallId: primaryResponse.toolResults[0].toolCallId,
          toolName: primaryResponse.toolResults[0].toolName,
          output: {
            type: "text",
            value: "User successfully added.",
          },
        };

        const toolCall: ToolCallPart = {
          type: "tool-call",
          toolCallId: primaryResponse.toolCalls[0].toolCallId,
          toolName: primaryResponse.toolResults[0].toolName,
          input: primaryResponse.toolCalls[0].input,
        };

        const toolResultMessage = {
          id: crypto.randomUUID(),
          role: "tool",
          content: [toolResult],
          ts: new Date(),
        };

        const toolCallMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: [toolCall],
          ts: new Date(),
        };

        const returnedMessages = [
          ...nextMessages,
          toolCallMessage,
          toolResultMessage,
        ] as ChatMessage[];

        setMessages(returnedMessages);

        const secondaryResponse = await askAI(
          returnedMessages.map(({ role, content }) => ({
            role,
            content,
          })) as ModelMessage[],
          "groq",
          prompt
        );

        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: secondaryResponse.text,
            ts: new Date(),
          },
        ]);
        
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: primaryResponse.text,
          ts: new Date(),
        },
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setTyping(false);
    }
  };

  const enterWorkspace = useCallback(() => {
    setAppMode("workspace");
    setContext(null);
    const primer: ChatMessage = {
      id: uid(),
      role: "assistant",
      content: WORKSPACE_PRIMER,
      ts: new Date(),
    };
    setMessages([primer]);
  }, []);

  const enterContext = useCallback((type: ContextType, id: string) => {
    setAppMode("context");
    setContext({ type, id });
    const primer = getMauricePrimer(type, id);
    setMessages([
      { id: uid(), role: "assistant", content: primer, ts: new Date() },
    ]);
  }, []);

  const exitConversation = useCallback(() => {
    setAppMode("module");
    setContext(null);
    setMessages([]);
    setTyping(false);
  }, []);

  const handleSend = async (text: string) => {
    if (!text.trim() || typing) return;

    const msg: ChatMessage = {
      id: uid(),
      role: "user",
      content: text,
      ts: new Date(),
    };

    const nextMessages: ChatMessage[] = [...messages, msg];

    setMessages(nextMessages);

    const ctype = context?.type ?? "workspace";
    await simulateResponse(ctype, nextMessages);
  };

  const guardedAction = useCallback(
    (action: () => void) => {
      if (!isGuest) {
        action();
        return;
      }
      setPendingAction(() => action);
      setAuthOpen(true);
    },
    [isGuest],
  );

  const handleAuth = useCallback(() => {
    setIsGuest(false);
    setAuthOpen(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [pendingAction]);

  const handleNavigate = useCallback((m: Module) => {
    setModule(m);
    setAppMode("module");
    setContext(null);
    setMessages([]);
  }, []);

  const isMauriceActive = appMode === "workspace" || appMode === "context";

  const renderModule = () => {
    if (appMode === "workspace") {
      return (
        <WorkspaceConversation
          messages={messages}
          typing={typing}
          onSend={handleSend}
          onClose={exitConversation}
        />
      );
    }
    if (appMode === "context" && context) {
      return (
        <ContextConversation
          context={context}
          messages={messages}
          typing={typing}
          onSend={handleSend}
          onClose={exitConversation}
        />
      );
    }
    switch (module) {
      case "dashboard":
        return <DashboardModule onContext={enterContext} />;
      case "projects":
        return (
          <ProjectsModule
            onContext={enterContext}
            onGuardedAction={guardedAction}
          />
        );
      case "ideas":
        return (
          <IdeasModule
            onContext={enterContext}
            onGuardedAction={guardedAction}
          />
        );
      case "notebook":
        return (
          <NotebookModule
            onContext={enterContext}
            onGuardedAction={guardedAction}
          />
        );
      case "technologies":
        return (
          <TechnologiesModule
            onContext={enterContext}
            onGuardedAction={guardedAction}
          />
        );
      case "evolution":
        return <EvolutionModule />;
      case "thoughts":
        return (
          <ThoughtsModule
            onContext={enterContext}
            onGuardedAction={guardedAction}
          />
        );
      case "graph":
        return <GraphModule onContext={enterContext} />;
      case "settings":
        return <SettingsModule />;
    }
  };

  return (
    <div className="relative flex h-screen overflow-hidden bg-background text-foreground">
      <FloatingBackground />

      {/* Desktop floating sidebar */}
      <div className="hidden lg:flex p-3 shrink-0" style={{ zIndex: 10 }}>
        <Sidebar
          active={module}
          onNavigate={handleNavigate}
          onPaletteOpen={() => setPaletteOpen(true)}
          onMaurice={() =>
            appMode === "workspace" ? exitConversation() : enterWorkspace()
          }
          onSignIn={() => setAuthOpen(true)}
          isGuest={isGuest}
          isMauriceActive={isMauriceActive}
        />
      </div>

      {/* Mobile nav drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.6)" }}
            onClick={() => setMobileNavOpen(false)}
          />
          <div
            className="absolute left-0 top-0 bottom-0 p-3"
            style={{ width: "268px", zIndex: 41 }}
          >
            <Sidebar
              active={module}
              onNavigate={handleNavigate}
              onPaletteOpen={() => {
                setPaletteOpen(true);
                setMobileNavOpen(false);
              }}
              onMaurice={() => {
                appMode === "workspace" ? exitConversation() : enterWorkspace();
                setMobileNavOpen(false);
              }}
              onSignIn={() => {
                setAuthOpen(true);
                setMobileNavOpen(false);
              }}
              isGuest={isGuest}
              isMauriceActive={isMauriceActive}
              onClose={() => setMobileNavOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <div
        className="relative flex flex-col flex-1 min-w-0 overflow-hidden"
        style={{ zIndex: 10 }}
      >
        {/* Mobile header */}
        <div
          className="lg:hidden flex items-center justify-between px-4 h-14 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <button
            onClick={() => setMobileNavOpen(true)}
            className="p-2 rounded-xl"
            style={{
              border: "1px solid rgba(255,255,255,0.09)",
              color: "#9a9a88",
            }}
          >
            <Menu size={16} />
          </button>
          <span
            className="text-[17px] text-foreground"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            Workbench
          </span>
          <button
            onClick={() => setPaletteOpen(true)}
            className="p-2 rounded-xl"
            style={{
              border: "1px solid rgba(255,255,255,0.09)",
              color: "#9a9a88",
            }}
          >
            <Search size={15} />
          </button>
        </div>

        <main
          className={`flex-1 overflow-y-auto ${module === "graph" && appMode === "module" ? "flex flex-col overflow-hidden" : ""} ${appMode !== "module" ? "flex flex-col overflow-hidden" : ""}`}
        >
          {renderModule()}
        </main>
      </div>

      {paletteOpen && (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          onNavigate={handleNavigate}
        />
      )}
      {authOpen && (
        <AuthModal
          onAuth={handleAuth}
          onClose={() => {
            setAuthOpen(false);
            setPendingAction(null);
          }}
        />
      )}
    </div>
  );
}
