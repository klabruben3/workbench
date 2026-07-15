import { LogIn, User } from "lucide-react";

export function AuthModal({
  onAuth,
  onClose,
}: {
  onAuth: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ paddingBottom: "8vh" }}
    >
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      />
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          width: "380px",
          background: "rgba(16, 13, 9, 0.98)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.8), 0 4px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {/* Top accent */}
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(233,180,76,0.4), transparent)",
          }}
        />

        <div className="p-8">
          {/* Icon */}
          <div className="flex items-center justify-center mb-6">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(233,180,76,0.08)",
                border: "1px solid rgba(233,180,76,0.18)",
              }}
            >
              <LogIn size={20} style={{ color: "#e9b44c" }} />
            </div>
          </div>

          <h2
            className="text-[20px] text-center text-foreground mb-2"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            Sign in to continue
          </h2>
          <p
            className="text-[13px] text-center mb-8 leading-relaxed"
            style={{ color: "#7a7a6a" }}
          >
            You are browsing as a guest. Sign in to create, edit, and save your
            work.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={onAuth}
              className="w-full flex items-center justify-center gap-3 h-11 rounded-xl text-[14px] font-semibold transition-all"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#f0ede6",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              }}
            >
              <User size={16} style={{ color: "#9a9a88" }} />
              Continue with Google
            </button>
            <button
              onClick={onAuth}
              className="w-full flex items-center justify-center gap-3 h-11 rounded-xl text-[14px] font-semibold transition-all"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#f0ede6",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              }}
            >
              <User size={16} style={{ color: "#9a9a88" }} />
              Continue with GitHub
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-4 text-[12px] py-2 transition-colors"
            style={{ color: "#5a5a4a" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#9a9a88")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#5a5a4a")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
