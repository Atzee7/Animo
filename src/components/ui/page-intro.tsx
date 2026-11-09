interface PageIntroProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function PageIntro({ eyebrow, title, description }: PageIntroProps) {
  return (
    <div className="mb-8">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          {description}
        </p>
      ) : null}
    </div>
  );
}
