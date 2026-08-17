const logos = ["Loomstack", "Fernbank", "Kindled Goods", "Harborworks", "BrightLoop", "Fieldcraft"];

export function TrustedBy() {
  return (
    <section className="border-y border-border bg-secondary/30 py-10">
      <div className="container flex flex-col items-center gap-6">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Trusted by modern businesses
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-70 grayscale">
          {logos.map((logo) => (
            <span key={logo} className="text-lg font-semibold tracking-tight text-foreground/70">
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
