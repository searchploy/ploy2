export function AnimatedGradient() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/*
       * One wide, very low-opacity wash instead of the three stacked colored
       * blobs this used to render — at matte-black values anything above ~8%
       * stops reading as light and starts reading as a brown tint.
       */}
      <div className="absolute left-1/2 top-[-26rem] h-[40rem] w-[70rem] -translate-x-1/2 rounded-[50%] bg-ploy-gold/[0.07] blur-[130px]" />

      {/* Hairline horizon across the top edge. */}
      <div className="absolute left-1/2 top-0 h-px w-[72%] -translate-x-1/2 bg-gradient-to-r from-transparent via-ploy-gold/25 to-transparent" />

      <div className="absolute inset-0 bg-grid opacity-[0.35] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
    </div>
  );
}
