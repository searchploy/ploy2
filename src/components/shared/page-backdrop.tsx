/*
 * The page's back plane. Fixed, and deliberately not animated.
 *
 * A fixed layer is already as slow as a layer can be — it holds still while
 * everything above it scrolls, which is the whole separation. Driving it from
 * a scroll listener on top of that only made it trail the page, since the
 * transform lands a frame behind a scroll that is composited off the main
 * thread. Left alone, it is composited with the scroll and costs nothing.
 */
export function PageBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="page-canvas absolute inset-0" />
      <div className="hero-grain absolute inset-0" />
    </div>
  );
}
