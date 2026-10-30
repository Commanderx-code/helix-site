// What the coming-soon page announces. Set `date` (an ISO instant, UTC) to
// show a countdown; leave it out and the page says "no date yet" instead.
export interface Soon {
  /** The small label above the title */
  eyebrow: string;
  /** The title; the last words after the final space are lit */
  title: string;
  text: string;
  /** When it arrives, as an ISO 8601 instant such as 2026-12-01T17:00:00Z */
  date?: string;
}

export const soon: Soon = {
  eyebrow: 'Coming soon',
  title: 'Config Bible is on its way.',
  text: 'A handbook for your own workstation, with search, in a web site and a desktop app. It opens once the personal parts are out of it.',
};
