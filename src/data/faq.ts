// Questions answered on the home page, drawn from what the tools' pages
// already say.
export interface Question {
  question: string;
  answer: string;
}

export const faq: Question[] = [
  {
    question: 'Are the tools free?',
    answer:
      'Yes. Helix Toolbox, Helix Boot, webOS Launcher and Touchdown are free and open source under the MIT license. Config Bible is not public yet.',
  },
  {
    question: 'Which Linux distributions does Helix Toolbox work on?',
    answer:
      'Linux on x86_64 or aarch64 with glibc 2.35 or later. It is tested on Arch, Debian, Ubuntu 22.04 and 24.04, Fedora and openSUSE Tumbleweed.',
  },
  {
    question: 'Will Helix Toolbox change my system without asking?',
    answer:
      'No. The Install Plan shows every step, its risk and any password prompt before anything runs, and nothing runs until you confirm. Every command also takes --dry-run.',
  },
  {
    question: 'Does Helix Boot include paid software?',
    answer:
      'No. It downloads free tools from their publishers and checks each one, and has slots for paid tools you bring yourself. Nothing is redistributed.',
  },
  {
    question: 'Could Helix Boot erase the wrong drive?',
    answer:
      'It only offers USB disks, asks you to type the stick’s name to confirm, and checks the device again before each write.',
  },
  {
    question: 'Do I need a rooted TV for webOS Launcher?',
    answer:
      'No. It runs on a stock LG TV with webOS 5 or later in Developer Mode. Rooting with Homebrew Channel adds recently used apps, the Plex Watchlist, a phone remote page, commercial mute, layout backup and app updates.',
  },
  {
    question: 'Does Touchdown work offline?',
    answer: 'Yes. It keeps working from cached results, and marks them as cached.',
  },
  {
    question: 'When will Config Bible be public?',
    answer: 'Its repository is private while the handbook is personal. Its page will link to it once it opens.',
  },
];
