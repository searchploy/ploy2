"use client";

export function SuccessCarousel() {
  const stories = [
    {
      name: "Sarah M.",
      location: "Austin, TX",
      earnings: "$2,850",
      initials: "SM",
      color: "#d9a441",
    },
    {
      name: "Marcus J.",
      location: "Brooklyn, NY",
      earnings: "$4,120",
      initials: "MJ",
      color: "#b7791f",
    },
    {
      name: "Alex K.",
      location: "Denver, CO",
      earnings: "$3,400",
      initials: "AK",
      color: "#9a6517",
    },
    {
      name: "Jessica L.",
      location: "Seattle, WA",
      earnings: "$5,200",
      initials: "JL",
      color: "#e6b94f",
    },
    {
      name: "David P.",
      location: "Boston, MA",
      earnings: "$3,950",
      initials: "DP",
      color: "#c58a24",
    },
    {
      name: "Emily R.",
      location: "San Francisco, CA",
      earnings: "$6,100",
      initials: "ER",
      color: "#f5d77a",
    },
  ];

  return (
    <section className="relative py-8 overflow-hidden">
      <div className="container">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-wide text-ploy-gold mb-2">First Month Earnings</p>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Consultants Making Money Immediately
            </h2>
          </div>

          <div className="slideshow-wrapper overflow-hidden">
            <div className="slideshow-track">
              {stories.map((story) => (
                <div
                  key={story.name}
                  className="slideshow-card flex-shrink-0 w-72"
                >
                  <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-card to-secondary/50 rounded-2xl border border-border/50 p-6 text-center">
                    <div
                      className="h-20 w-20 rounded-full flex items-center justify-center mb-4 text-white font-bold text-xl"
                      style={{ backgroundColor: story.color }}
                    >
                      {story.initials}
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{story.name}</h3>
                    <p className="text-xs text-muted-foreground mb-4">{story.location}</p>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">First Month</p>
                      <p className="text-2xl font-bold text-ploy-gold">{story.earnings}</p>
                    </div>
                  </div>
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {stories.map((story) => (
                <div
                  key={`${story.name}-duplicate`}
                  className="slideshow-card flex-shrink-0 w-72"
                >
                  <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-card to-secondary/50 rounded-2xl border border-border/50 p-6 text-center">
                    <div
                      className="h-20 w-20 rounded-full flex items-center justify-center mb-4 text-white font-bold text-xl"
                      style={{ backgroundColor: story.color }}
                    >
                      {story.initials}
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{story.name}</h3>
                    <p className="text-xs text-muted-foreground mb-4">{story.location}</p>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">First Month</p>
                      <p className="text-2xl font-bold text-ploy-gold">{story.earnings}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
