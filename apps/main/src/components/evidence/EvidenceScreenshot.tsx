import Image from "next/image";
import type { ReactNode } from "react";
import type { EvidenceImage } from "./types";

export function EvidenceScreenshot({
  image,
  children,
  inspect = true,
}: {
  image: EvidenceImage;
  children?: ReactNode;
  inspect?: boolean;
}) {
  return (
    <figure className="evidence-figure">
      {children ?? (
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          unoptimized
          className="evidence-image"
        />
      )}
      <figcaption className="evidence-caption">
        <span>{image.caption}</span>
        {inspect && (
          <a
            href={image.src}
            target="_blank"
            rel="noopener noreferrer"
            className="evidence-inspect"
          >
            Inspect full image <span aria-hidden="true">↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </figcaption>
    </figure>
  );
}
