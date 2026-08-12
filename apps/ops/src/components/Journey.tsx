import { journey } from "@/data/journey";
import Link from "next/link";

export default function Journey() {
  return (
    <section id="journey" className="  border-b border-line py-24 md:py-28">
      <div className="mb-16 max-w-3xl">
        <p className="eyebrow text-xs font-bold uppercase">Changelog</p>

        <h2 className="mt-3 text-3xl font-bold text-fg md:text-4xl">
          The journey so far.
        </h2>

        <p className="mt-6 text-lg leading-8 text-fg-muted">
          The milestones, decisions, and turning points that have shaped my path
          as a software engineer.
        </p>
      </div>

      <ol className="relative border-l border-line pl-8">
        {journey.map((item, i) => (
          <li key={item.title} className="relative pb-12 last:pb-0">
            <span
              className={`absolute -left-9.5 top-1 size-3 rounded-full ${
                i === 0 ? "bg-amber" : "bg-fg-dim"
              }`}
            />

            <p className="mono text-xs uppercase tracking-wide text-fg-dim">
              {item.period}
            </p>

            <h3 className="mt-2 text-lg font-semibold text-fg">{item.title}</h3>
            {item.tasks.map((task, i) => (
              <p className="mt-2 max-w-4xl leading-7 text-fg-muted" key={i}>
                {task.description}
                {task.url && task.label && (
                  <Link href={task.url} target="_blank">
                    <span className="text-amber font-semibold">
                      {" "}
                      {task.label}
                    </span>
                  </Link>
                )}
              </p>
            ))}
          </li>
        ))}
      </ol>
    </section>
  );
}
