'use client';

import { useId, useState } from 'react';
import { preload } from 'react-dom';
import { ZoomFocusViewer } from './ZoomFocusViewer';
import type { WalkthroughStep } from './types';

export function GuidedWalkthrough({
  steps,
  label,
}: {
  steps: WalkthroughStep[];
  label: string;
}) {
  const [active, setActive] = useState(0);
  const id = useId();
  const step = steps[active];
  // Load each original once so navigation and zoom never swap image quality.
  for (const { image } of steps) preload(image.src, { as: 'image' });
  return (
    <section className="evidence-walkthrough panel" aria-label={label}>
      <div className="evidence-toolbar">
        <span>Captured from the application</span>
        <span>{step.image.status}</span>
      </div>
      <div className="evidence-layout">
        <div className="min-w-0">
          <ZoomFocusViewer
            key={active}
            image={step.image}
            focus={step.focus}
            annotation={step.annotation}
            descriptionId={`${id}-annotation`}
          />
        </div>
        <div className="evidence-guide">
          <p className="text-sm text-fg-muted">Guided inspection</p>
          <ol
            className="evidence-step-list"
            aria-label="Walkthrough steps"
            onKeyDown={(event) => {
              const keys: Record<string, number> = {
                ArrowRight: Math.min(active + 1, steps.length - 1),
                ArrowDown: Math.min(active + 1, steps.length - 1),
                ArrowLeft: Math.max(active - 1, 0),
                ArrowUp: Math.max(active - 1, 0),
                Home: 0,
                End: steps.length - 1,
              };
              if (event.key in keys) {
                event.preventDefault();
                const index = keys[event.key];
                setActive(index);
                event.currentTarget.querySelectorAll('button')[index]?.focus();
              }
            }}
          >
            {steps.map((item, index) => (
              <li key={item.title}>
                <button
                  type="button"
                  aria-current={index === active ? 'step' : undefined}
                  onClick={() => setActive(index)}
                >
                  <span className="evidence-step-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {item.title}
                </button>
              </li>
            ))}
          </ol>
          <div
            className="evidence-step-copy"
            aria-live="polite"
            aria-atomic="true"
          >
            <p className="text-xs text-fg-muted">
              Step {active + 1} of {steps.length}
            </p>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
          <div className="evidence-pagination">
            <button
              type="button"
              disabled={active === 0}
              onClick={() => setActive(active - 1)}
            >
              ← Previous
            </button>
            <button
              type="button"
              disabled={active === steps.length - 1}
              onClick={() => setActive(active + 1)}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
