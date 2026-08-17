export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar_url: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "We replaced two contractor tools and a part-time SDR with one AI employee from the marketplace. Payback was under six weeks.",
    author: "Dana Ferreira",
    role: "VP Revenue",
    company: "Loomstack",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
  },
  {
    id: "t2",
    quote:
      "Ploy made it easy to compare AI employees from different agencies side by side. We knew exactly what we were buying before we talked to anyone.",
    author: "Michael Osei",
    role: "Head of Support",
    company: "Fernbank",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
  },
  {
    id: "t3",
    quote:
      "The agency that built our AI bookkeeper had it live in four days. We didn't write a line of code.",
    author: "Sarah Kim",
    role: "Founder",
    company: "Kindled Goods",
    avatar_url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop",
  },
  {
    id: "t4",
    quote:
      "As an agency, Ploy gave us distribution we couldn't get on our own. Half our new customers now come through the marketplace.",
    author: "Theo Marchetti",
    role: "Co-founder",
    company: "Northbeam AI",
    avatar_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop",
  },
];
