export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar_url: string;
}

/**
 * Empty on purpose.
 *
 * This list previously held invented quotes attributed to named people at
 * named companies ("Dana Ferreira, VP Revenue, Loomstack" and similar). A
 * fabricated endorsement presented as a real customer is a misrepresentation
 * regardless of intent, so the content was removed rather than reworded.
 *
 * Add entries here only for real customers who have given permission to be
 * quoted and named. TestimonialsSection renders nothing while this is empty,
 * so the homepage simply omits the section until then.
 */
export const testimonials: Testimonial[] = [];
