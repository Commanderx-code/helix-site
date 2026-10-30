// What people who use the tools have said, with their permission to show
// their name. The home page shows the section only once there is one.
export interface Testimonial {
  quote: string;
  name: string;
  /** Who they are, in a few words: "Arch user", "Homelab tinkerer" */
  role?: string;
  /** The slug of the tool they are talking about */
  tool?: string;
  /** Where they said it, such as a GitHub issue or a forum post */
  source?: string;
}

export const testimonials: Testimonial[] = [];
