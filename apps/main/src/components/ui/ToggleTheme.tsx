"use client";
import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";

const subscribe = () => () => undefined;
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);

  if (!mounted) {
    // Same markup shape on server and first client paint — no mismatch.
    return <button disabled className={className} aria-label="Toggle theme" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={className}
    >
      {isDark ? <HiOutlineSun size={18} /> : <HiOutlineMoon size={18} />}
    </button>
  );
}
