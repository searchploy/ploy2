"use client";

export function AnimatedGradient() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute left-1/2 top-[-10%] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-ploy-blue/25 via-ploy-blue-light/20 to-transparent blur-3xl animate-gradient-shift" />
      <div className="absolute right-[5%] top-[20%] h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-ploy-blue-light/20 to-transparent blur-3xl animate-gradient-shift [animation-delay:-4s]" />
      <div className="absolute inset-0 bg-grid opacity-[0.4] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
    </div>
  );
}
