interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export function SectionTitle({ eyebrow, title, subtitle }: SectionTitleProps) {
  return (
    <div className="max-w-3xl">
      {eyebrow && (
        <p className="eyebrow mb-3 text-xs uppercase">{eyebrow}</p>
      )}

      <h2 className="text-3xl font-bold tracking-tight text-fg md:text-4xl">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-4 text-lg leading-8 text-fg-muted">{subtitle}</p>
      )}
    </div>
  );
}
