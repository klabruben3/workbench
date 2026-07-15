import { FloatCard, Mono, GhostBtn } from "@/components/ui";

export function SettingsModule() {
  const sections = [
    {
      title: "Account",
      items: [
        { label: "Name", value: "Jamie Chen", type: "input" as const },
        { label: "Email", value: "jamie@local.dev", type: "input" as const },
      ],
    },
    {
      title: "Appearance",
      items: [
        { label: "Theme", value: "Dark (always)", type: "static" as const },
        { label: "Reduced motion", value: "false", type: "toggle" as const },
      ],
    },
    {
      title: "Data & Export",
      items: [
        {
          label: "Download full data export",
          value: "",
          type: "action" as const,
        },
      ],
    },
    {
      title: "Devfolio Sync",
      items: [
        {
          label: "Public site URL",
          value: "jamie.design",
          type: "static" as const,
        },
        {
          label: "Public entities",
          value: "1 project · 0 ideas",
          type: "static" as const,
        },
      ],
    },
  ];

  return (
    <div className="p-5 md:p-8 pb-16 max-w-[680px] mx-auto">
      <h2
        className="text-[28px] text-foreground mb-8"
        style={{ fontFamily: '"DM Serif Display", serif' }}
      >
        Settings
      </h2>
      <div className="flex flex-col gap-7">
        {sections.map((section) => (
          <div key={section.title}>
            <Mono
              className="text-[10px] font-semibold uppercase tracking-[0.1em] block mb-3"
              style={{ color: "#4a4a40" }}
            >
              {section.title}
            </Mono>
            <FloatCard className="overflow-hidden">
              {section.items.map((item, i) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between px-5 py-4"
                  style={{
                    borderTop:
                      i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  }}
                >
                  <label className="text-[14px] font-medium text-foreground">
                    {item.label}
                  </label>
                  {item.type === "input" && (
                    <input
                      defaultValue={item.value}
                      className="text-[13px] bg-transparent rounded-xl px-3 h-8 text-right outline-none w-48"
                      style={{
                        border: "1px solid rgba(255,255,255,0.09)",
                        color: "#9a9a88",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    />
                  )}
                  {item.type === "static" && (
                    <Mono className="text-[13px]" style={{ color: "#7a7a6a" }}>
                      {item.value}
                    </Mono>
                  )}
                  {item.type === "toggle" && (
                    <div
                      className="relative w-9 h-5 rounded-full cursor-pointer"
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.12)",
                      }}
                    >
                      <div
                        className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full"
                        style={{ background: "#5a5a4a" }}
                      />
                    </div>
                  )}
                  {item.type === "action" && <GhostBtn>Export JSON</GhostBtn>}
                </div>
              ))}
            </FloatCard>
          </div>
        ))}
      </div>
    </div>
  );
}
