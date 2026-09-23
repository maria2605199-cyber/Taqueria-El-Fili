import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger" | "whatsapp";
type Size = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-500 text-white hover:bg-brand-600 shadow-glow focus-visible:ring-brand-400",
  secondary: "bg-ink-900 text-white hover:bg-ink-800 focus-visible:ring-ink-600",
  ghost: "bg-transparent text-ink-900 hover:bg-ink-900/5 focus-visible:ring-ink-300",
  outline: "border border-ink-900/15 text-ink-900 hover:bg-ink-900/5 focus-visible:ring-ink-300",
  danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-400",
  whatsapp: "bg-[#25D366] text-white hover:bg-[#1fb959] focus-visible:ring-green-400",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
  icon: "h-10 w-10 p-0",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 ring-offset-2 active:scale-[0.98]",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
