import { cn } from "@/src/lib/utils";

interface DotGridProps {
  className?: string;
  variant?: "dark" | "light";
}

/**
 * Signature motif for Lumiq AI — subtle dot-grid suggesting "learning nodes".
 * Use over hero sections with `pointer-events-none` wrapper.
 */
export default function DotGrid({ className, variant = "dark" }: DotGridProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0",
        variant === "dark" ? "dot-grid" : "dot-grid-faint",
        className,
      )}
    />
  );
}
