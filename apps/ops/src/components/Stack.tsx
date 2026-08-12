import { techStack } from "@/data/techStack";
import { useState } from "react";

export default function Stack() {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <div className="pointer-events-none sticky z-0 w-64 h-full pb-24 xl:block hidden bg-panel-raised pt-28">
      <div className="stack-scroll sticky top-28 flex max-h-[calc(100vh-4rem)] flex-col items-center gap-4 overflow-y-auto">
        <p className="eyebrow text-amber-dim text-xs font-bold tracking-widest uppercase">
          Technologies
        </p>
        <div className="pointer-events-auto flex w-full flex-col items-center gap-4 overflow-hidden">
          {techStack.map((group) => (
            <div
              key={group.category}
              className="flex flex-col items-center gap-1.5"
            >
              <p className="mono text-[10px] tracking-widest text-fg-dim/60 uppercase">
                {group.category}
              </p>
              <div className="grid grid-cols-3 gap-1 overflow-hidden">
                {group.items.map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noopener nofollow"
                    title={item.name}
                    className="
                      group isolate
                      bg-panel hover:bg-panel-raised
                      before:absolute before:top-1/2 before:left-1/2 before:z-10 grayscale-0
                      before:h-60 before:w-60 before:content-['']
                      before:[--gradient-0:var(--amber-dim)] before:[--gradient-1:var(--panel)]
                      before:bg-[conic-gradient(from_0deg_at_50%_50%,var(--gradient-0)_0deg,var(--gradient-1)_45deg,var(--gradient-1)_135deg,var(--gradient-0)_180deg,var(--gradient-1)_225deg,var(--gradient-1)_315deg,var(--gradient-0)_360deg)]
                      before:bg-center before:bg-size-[240px_240px]
                      before:translate(-50%,-50%)_rotate(45deg)_scale(1.45)]
                      before:animate-[stack-spin_10s_linear_infinite]
                      before:opacity-0 before:transition-opacity
                      hover:before:opacity-100 focus-visible:before:opacity-100
                      group relative flex aspect-square w-20 items-center justify-center overflow-hidden transition-colors duration-500 hover:border-amber-dim
                    "
                    onMouseEnter={() => setHovered(item.name)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <div className="flex aspect-square w-[95%] bg-panel items-center z-10 justify-center">
                      <item.icon
                        size={22}
                        style={{
                          color: hovered === item.name ? item.color : "",
                        }}
                        className="text-fg-muted transition-all group-hover:scale-125 duration-300"
                      />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
