import FadeIn from "@/components/ui/FadeIn";

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <FadeIn>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          {eyebrow && (
            <p className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-2">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-3xl sm:text-4xl">{title}</h1>
          {subtitle && (
            <p className="text-foreground/55 mt-2 max-w-2xl">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
    </FadeIn>
  );
}
