"use client";

import Image from "next/image";
import { useState } from "react";
import { EvidenceScreenshot } from "./EvidenceScreenshot";
import type { EvidenceImage, FocusRegion } from "./types";

export function ZoomFocusViewer({
  image,
  focus,
  annotation,
  descriptionId,
}: {
  image: EvidenceImage;
  focus?: FocusRegion;
  annotation: string;
  descriptionId: string;
}) {
  const [focused, setFocused] = useState(false);
  const [dim, setDim] = useState(false);
  const scale =
    focused && focus
      ? Math.min(3, 0.88 / Math.max(focus.width, focus.height))
      : 1;
  const clamp = (value: number) => Math.min(0, Math.max(1 - scale, value));
  const x = focus ? clamp(0.5 - scale * (focus.x + focus.width / 2)) * 100 : 0;
  const y = focus ? clamp(0.5 - scale * (focus.y + focus.height / 2)) * 100 : 0;

  return (
    <div>
      <EvidenceScreenshot image={image}>
        <div
          className="evidence-viewport"
          data-focused={focused}
          aria-describedby={descriptionId}
          style={{ aspectRatio: `${image.width} / ${image.height}` }}
        >
          <div
            className="evidence-camera"
            style={{
              transform: focused
                ? `translate(${x}%, ${y}%) scale(${scale})`
                : "none",
            }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              loading="eager"
              unoptimized
              className="evidence-image"
            />
            {focus && (focused || dim) && (
              <span
                aria-hidden="true"
                className={`evidence-focus ${dim ? "evidence-focus-dim" : ""}`}
                style={{
                  left: `${focus.x * 100}%`,
                  top: `${focus.y * 100}%`,
                  width: `${focus.width * 100}%`,
                  height: `${focus.height * 100}%`,
                }}
              />
            )}
          </div>
        </div>
      </EvidenceScreenshot>
      <div
        className="evidence-view-controls"
        role="group"
        aria-label="Screenshot focus controls"
        aria-describedby={!focus ? `${descriptionId}-focus-help` : undefined}
      >
        <button
          type="button"
          disabled={!focus}
          aria-pressed={focused}
          onClick={() => {
            setFocused(!focused);
            if (focused) setDim(false);
          }}
        >
          {focused ? "Reset to full view" : "Zoom to evidence"}{" "}
          <span aria-hidden="true">{focused ? "↙" : "⌕"}</span>
        </button>
        <label>
          <input
            type="checkbox"
            checked={dim}
            disabled={!focus}
            onChange={(e) => setDim(e.target.checked)}
          />{" "}
          Dim surroundings
        </label>
      </div>
      {!focus && (
        <p className="evidence-focus-help" id={`${descriptionId}-focus-help`}>
          Choose a detail step to use zoom and dimming.
        </p>
      )}
      <p className="evidence-annotation" id={descriptionId}>
        <span className="mono" aria-hidden="true">
          ↳
        </span>{" "}
        {annotation}
      </p>
    </div>
  );
}
