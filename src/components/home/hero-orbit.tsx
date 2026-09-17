const RING = "rgba(255,255,255,0.13)";

/*
 * Circumferences are precomputed so the travelling arcs can be expressed as
 * "show this many pixels, hide the rest" — a dash pattern is the cheapest way
 * to draw a moving highlight along a circle without a second element.
 */
const arc = (radius: number, visible: number) =>
  `${visible} ${2 * Math.PI * radius - visible}`;

export function HeroOrbit() {
  return (
    <div className="relative aspect-square w-full max-w-[30rem]">
      <div
        aria-hidden
        className="absolute inset-[18%] rounded-full bg-white/[0.07] blur-[64px]"
      />

      <svg
        viewBox="0 0 400 400"
        className="relative h-full w-full overflow-visible"
        aria-hidden
      >
        <circle
          cx="200"
          cy="200"
          r="192"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
          strokeDasharray="2 10"
          className="orbit-spin"
          style={{ animationDuration: "90s" }}
        />

        <circle cx="200" cy="200" r="158" fill="none" stroke={RING} strokeWidth="1" />
        <circle
          cx="200"
          cy="200"
          r="158"
          fill="none"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray={arc(158, 78)}
          className="orbit-spin"
          style={{ animationDuration: "15s" }}
        />

        <circle
          cx="200"
          cy="200"
          r="120"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
          strokeDasharray="1 7"
          className="orbit-spin"
          style={{ animationDuration: "55s", animationDirection: "reverse" }}
        />

        <circle cx="200" cy="200" r="84" fill="none" stroke={RING} strokeWidth="1" />
        <circle
          cx="200"
          cy="200"
          r="84"
          fill="none"
          stroke="rgba(255,255,255,0.38)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray={arc(84, 46)}
          className="orbit-spin"
          style={{ animationDuration: "9s", animationDirection: "reverse" }}
        />

        <circle cx="200" cy="200" r="44" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />

        {/* Expanding echoes off the core, offset so one is always mid-flight. */}
        <circle
          cx="200"
          cy="200"
          r="150"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
          className="orbit-pulse"
        />
        <circle
          cx="200"
          cy="200"
          r="150"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
          className="orbit-pulse"
          style={{ animationDelay: "2.25s" }}
        />

        {/* Nodes. Each sits at the top of its ring and is carried round by its group. */}
        <g className="orbit-spin" style={{ animationDuration: "22s" }}>
          <circle cx="200" cy="42" r="4.5" fill="#fff" />
        </g>
        <g className="orbit-spin" style={{ animationDuration: "32s" }}>
          <circle cx="200" cy="8" r="2.5" fill="rgba(255,255,255,0.45)" />
        </g>
        <g
          className="orbit-spin"
          style={{ animationDuration: "14s", animationDirection: "reverse" }}
        >
          <circle cx="200" cy="80" r="3" fill="rgba(255,255,255,0.7)" />
        </g>
        <g className="orbit-spin" style={{ animationDuration: "8s" }}>
          <circle cx="200" cy="116" r="2.5" fill="rgba(255,255,255,0.55)" />
        </g>

        <circle cx="200" cy="200" r="5.5" fill="hsl(39 67% 55%)" />
      </svg>
    </div>
  );
}
