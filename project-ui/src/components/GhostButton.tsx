import type { ButtonHTMLAttributes, ReactNode } from "react";

type GhostButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function GhostButton({ className = "", children, type = "button", ...props }: GhostButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl text-sm font-semibold transition hover:bg-white/5 disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
