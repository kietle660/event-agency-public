type FloatingContactButtonsProps = {
  hotline: string;
  facebookUrl: string;
};

function normalizePhoneNumber(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

function buildZaloUrl(phone: string) {
  const normalized = normalizePhoneNumber(phone).replace(/^\+84/, "0");
  return normalized ? `https://zalo.me/${normalized}` : "";
}

export default function FloatingContactButtons({
  hotline,
  facebookUrl,
}: FloatingContactButtonsProps) {
  const phone = normalizePhoneNumber(hotline);
  const zaloUrl = buildZaloUrl(hotline);

  const buttons = [
    {
      label: "Zalo",
      href: zaloUrl,
      bgClass: "from-sky-400 to-cyan-500",
      ringClass: "shadow-[0_0_0_8px_rgba(56,189,248,0.12)]",
      icon: <span className="text-base font-black tracking-wide">Z</span>,
    },
    {
      label: "Facebook",
      href: facebookUrl,
      bgClass: "from-blue-400 to-blue-600",
      ringClass: "shadow-[0_0_0_8px_rgba(59,130,246,0.12)]",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path
            d="M12 21c4.97 0 9-3.91 9-8.75S16.97 3.5 12 3.5 3 7.41 3 12.25c0 2.76 1.31 5.22 3.36 6.83V21l2.48-1.36c.98.4 2.06.61 3.16.61Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      label: "Hotline",
      href: phone ? `tel:${phone}` : "",
      bgClass: "from-rose-400 to-red-500",
      ringClass: "shadow-[0_0_0_8px_rgba(244,63,94,0.12)]",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path
            d="M6.7 4.8h2.26c.31 0 .58.22.65.52l.51 2.27a.72.72 0 0 1-.2.68L8.55 9.62a13.1 13.1 0 0 0 5.83 5.83l1.37-1.37c.18-.18.45-.26.69-.2l2.26.52c.3.06.52.33.52.64v2.27c0 .37-.3.68-.68.7-.63.04-1.26.06-1.9.06C9.95 18.07 5.93 14.05 5.93 9.36c0-.64.02-1.27.07-1.9.02-.38.32-.68.7-.68Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ].filter((item) => item.href);

  if (!buttons.length) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-3 z-40 flex flex-col gap-3 sm:bottom-8 sm:right-5">
      {buttons.map((button) => (
        <a
          key={button.label}
          href={button.href}
          target={button.label === "Hotline" ? undefined : "_blank"}
          rel={button.label === "Hotline" ? undefined : "noopener noreferrer"}
          aria-label={button.label}
          className={`group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${button.bgClass} text-white transition duration-300 hover:scale-105 ${button.ringClass}`}
        >
          <span className="absolute inset-0 rounded-full bg-white/20 animate-[ping_2.2s_ease-out_infinite]" />
          <span className="absolute inset-[-6px] rounded-full border border-white/20 animate-[contactPulse_2.2s_ease-out_infinite]" />
          <span className="absolute inset-0 rounded-full border border-white/25" />
          <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-sm">
            {button.icon}
          </span>
          <span className="pointer-events-none absolute right-[calc(100%+12px)] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/85 px-3 py-1 text-xs text-white/80 shadow-lg transition group-hover:flex">
            {button.label}
          </span>
        </a>
      ))}

      <style>{`
        @keyframes contactPulse {
          0% {
            opacity: 0.45;
            transform: scale(0.92);
          }
          70% {
            opacity: 0;
            transform: scale(1.18);
          }
          100% {
            opacity: 0;
            transform: scale(1.18);
          }
        }
      `}</style>
    </div>
  );
}
