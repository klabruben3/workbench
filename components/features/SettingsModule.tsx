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
    <div className="px-8 pt-12 pb-16 max-w-[720px] mx-auto">
      <h2 className="text-[20px] font-semibold text-foreground mb-8">
        Settings
      </h2>
      <div className="flex flex-col gap-8">
        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.06em] mb-3">
              {section.title}
            </h3>
            <div
              className="rounded-[10px] border border-border overflow-hidden"
              style={{ background: "#131310" }}
            >
              {section.items.map((item, i) => (
                <div
                  key={item.label}
                  className={`flex items-center justify-between px-5 py-4 ${i > 0 ? "border-t border-border" : ""}`}
                >
                  <label className="text-[14px] font-medium text-foreground">
                    {item.label}
                  </label>
                  {item.type === "input" && (
                    <input
                      defaultValue={item.value}
                      className="text-[14px] text-muted-foreground bg-transparent border border-border rounded-[6px] px-3 h-8 text-right outline-none focus:border-primary transition-colors w-48"
                    />
                  )}
                  {item.type === "static" && (
                    <span className="text-[14px] text-muted-foreground">
                      {item.value}
                    </span>
                  )}
                  {item.type === "toggle" && (
                    <div
                      className="relative w-9 h-5 rounded-full cursor-pointer transition-colors"
                      style={{
                        background: "rgba(240,237,230,0.12)",
                        border: "1px solid rgba(240,237,230,0.15)",
                      }}
                    >
                      <div
                        className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform"
                        style={{ background: "#7a7a6a" }}
                      />
                    </div>
                  )}
                  {item.type === "action" && (
                    <button className="text-[13px] font-medium px-3 h-8 rounded-[6px] border border-border text-foreground hover:border-[rgba(240,237,230,0.18)] transition-colors">
                      Export JSON
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
