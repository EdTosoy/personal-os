export interface EvidenceImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  status: string;
}

/** Fractions of the original screenshot, independent of its rendered size. */
export interface FocusRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WalkthroughStep {
  title: string;
  description: string;
  annotation: string;
  image: EvidenceImage;
  focus?: FocusRegion;
}
