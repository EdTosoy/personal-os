"use client";

import { Fragment, useLayoutEffect, useRef, useState } from "react";
import { journey, journeyTimelineConfig } from "@/data/journey";
import Link from "next/link";

const orderedJourney = [...journey].sort((a, b) =>
  b.startDate.localeCompare(a.startDate),
);

export default function Journey() {
  const [expanded, setExpanded] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const collapseTop = useRef<number | null>(null);
  const visibleCount = Math.max(1, journeyTimelineConfig.initialVisibleCount);
  const hiddenCount = Math.max(0, orderedJourney.length - visibleCount);
  const shownCount = expanded
    ? orderedJourney.length
    : Math.min(visibleCount, orderedJourney.length);

  useLayoutEffect(() => {
    if (collapseTop.current === null || !buttonRef.current) return;
    // Keep the collapse control at the same viewport position after hiding rows.
    const offset = buttonRef.current.getBoundingClientRect().top - collapseTop.current;
    window.scrollBy({ top: offset, behavior: "instant" });
    collapseTop.current = null;
  }, [expanded]);

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

      <ol id="journey-timeline" className="relative border-l border-line pl-8">
        {orderedJourney.map((item, i) => (
          <li
            key={item.title}
            hidden={!expanded && i >= visibleCount}
            className={`relative ${i === shownCount - 1 ? "pb-0" : "pb-12"}`}
          >
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
                {task.emphasis
                  ? task.description.split(task.emphasis).map((part, index) => (
                      <Fragment key={index}>
                        {index > 0 && <em>{task.emphasis}</em>}
                        {part}
                      </Fragment>
                    ))
                  : task.description}
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
      {hiddenCount > 0 && (
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={expanded}
          aria-controls="journey-timeline"
          className="mono mt-8 min-h-11 w-full rounded-xl border border-line px-4 py-3 text-sm text-fg-muted transition-colors duration-200 hover:border-amber-dim hover:text-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber motion-reduce:transition-none"
          onClick={() => {
            if (expanded && buttonRef.current) {
              collapseTop.current = buttonRef.current.getBoundingClientRect().top;
            }
            setExpanded(!expanded);
          }}
        >
          {expanded ? "Show fewer milestones" : `Show ${hiddenCount} earlier milestones`}
        </button>
      )}
    </section>
  );
}
