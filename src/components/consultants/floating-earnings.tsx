/*
 * Ambient decoration for the consultant pitch: amounts drifting up and fading
 * in the margins either side of the column.
 *
 * Positions are hand-placed rather than random so the server and client agree,
 * and they stay inside the outer 8% of the viewport. The layer sits above the
 * page, so the margin is not a guarantee — the widest sections reach close to
 * the edge — which is why the peak opacity is low enough that a figure passing
 * behind a card edge reads as texture rather than breakage. Below xl there is
 * no margin to drift in at all, so the layer is dropped.
 *
 * The figures are ornamental and deliberately unlabelled — they are not a
 * claim about what a consultant earns, and nothing here should be given a
 * caption that would turn them into one.
 */
const EARNINGS = [
  { label: "+$2,500", left: "1.5%", top: "14%", delay: "0s", duration: "13s", size: "1.25rem" },
  { label: "+$1,000", left: "5%", top: "34%", delay: "2.6s", duration: "11s", size: "1rem" },
  { label: "+$5,000", left: "2%", top: "58%", delay: "5.1s", duration: "14s", size: "1.35rem" },
  { label: "+$750", left: "5.5%", top: "76%", delay: "1.4s", duration: "12s", size: "0.9rem" },
  { label: "+$3,200", left: "1%", top: "88%", delay: "7.3s", duration: "13s", size: "1.1rem" },
  { label: "+$1,500", left: "4%", top: "4%", delay: "9.2s", duration: "12s", size: "1rem" },
  { right: "1.5%", label: "+$4,800", top: "9%", delay: "3.4s", duration: "12s", size: "1.2rem" },
  { right: "5%", label: "+$2,000", top: "28%", delay: "6.8s", duration: "14s", size: "1rem" },
  { right: "1%", label: "+$10,000", top: "48%", delay: "1.9s", duration: "15s", size: "1.4rem" },
  { right: "5.5%", label: "+$1,250", top: "66%", delay: "8.6s", duration: "11s", size: "0.9rem" },
  { right: "2%", label: "+$6,500", top: "82%", delay: "4.5s", duration: "13s", size: "1.2rem" },
  { right: "4.5%", label: "+$900", top: "94%", delay: "10.4s", duration: "12s", size: "0.9rem" },
];

export function FloatingEarnings() {
  return (
    <div
      aria-hidden
      className="money-drift pointer-events-none fixed inset-0 z-20 hidden overflow-hidden xl:block"
    >
      {EARNINGS.map((item) => (
        <span
          key={item.label + item.top}
          className="money-drift-item absolute font-mono font-bold text-ploy-gold"
          style={{
            left: item.left,
            right: item.right,
            top: item.top,
            fontSize: item.size,
            animationDelay: item.delay,
            animationDuration: item.duration,
          }}
        >
          {item.label}
        </span>
      ))}
    </div>
  );
}
