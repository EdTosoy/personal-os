"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

const subscribe = () => () => undefined;
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export default function ThemeFavicon() {
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const isLight = mounted && resolvedTheme === "light";

  return (
    <link
      rel="icon"
      href={isLight ? "/brand/et-sienna.svg" : "/brand/et-blue.svg"}
      type="image/svg+xml"
      sizes="any"
    />
  );
}
