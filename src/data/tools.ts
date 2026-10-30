import type { ImageMetadata } from 'astro';

import bootMenu from '../assets/tools/boot/boot-menu.jpg';
import bootThemes from '../assets/tools/boot/themes.jpg';
import bootLazarus from '../assets/tools/boot/lazarus-launcher.jpg';
import bootWindows from '../assets/tools/boot/windows-app.png';
import bootIcon from '../assets/tools/boot/helix-logo.png';
import toolboxDashboard from '../assets/tools/toolbox/dashboard.png';
import toolboxPlan from '../assets/tools/toolbox/plan.png';
import toolboxApps from '../assets/tools/toolbox/applications.png';
import toolboxDoctor from '../assets/tools/toolbox/doctor.png';
import toolboxGui from '../assets/tools/toolbox/gui-dashboard.png';
import toolboxIcon from '../assets/tools/toolbox/icon.svg';
import bibleIcon from '../assets/tools/config-bible/icon.svg';
import webosIcon from '../assets/tools/webos/largeIcon.png';
import tdDashboard from '../assets/tools/touchdown/dashboard.png';
import tdGame from '../assets/tools/touchdown/game-center.png';
import tdSeason from '../assets/tools/touchdown/season.png';
import tdIcon from '../assets/tools/touchdown/icon.svg';

export interface Shot {
  src: ImageMetadata;
  alt: string;
}

export interface Install {
  title: string;
  note?: string;
  code?: string;
}

export interface Tool {
  slug: string;
  name: string;
  /** GitHub repository, owner/name; absent while the repository is private */
  repo?: string;
  /** Shown when the repository is private */
  availability?: string;
  /** The kind of job the tool does, in a word or two */
  category: string;
  pitch: string;
  summary: string;
  /** Three short lines for the home page card of a tool without screenshots */
  highlights?: string[];
  icon?: ImageMetadata;
  platforms: string;
  license?: string;
  features: string[];
  shots: Shot[];
  install: Install[];
  docs?: string;
}

export const tools: Tool[] = [
  {
    slug: 'toolbox',
    name: 'Helix Toolbox',
    category: 'Linux setup',
    repo: 'Commanderx-code/Helix-toolbox',
    pitch: 'Set up and look after a Linux machine from one menu in the terminal.',
    summary:
      'Applications, dotfiles and shell configuration, system tweaks, updates, backups and health checks. Every change is planned, shown with its risk, confirmed, verified and recorded.',
    icon: toolboxIcon,
    platforms: 'Linux on x86_64 or aarch64 with glibc 2.35 or later. Tested on Arch, Debian, Ubuntu 22.04 and 24.04, Fedora and openSUSE Tumbleweed.',
    license: 'MIT',
    features: [
      'A catalog of hundreds of applications and tweaks, with profiles and a first-run wizard for developer, gaming, privacy and minimal setups.',
      'Knows your machine: what is installed and from where (pacman, apt, dnf, zypper, AUR, Flatpak), its version and any waiting updates.',
      'The Install Plan shows every step, its risk and any password prompt, and checks conflicts, repositories, hardware and disk space before anything runs.',
      'Runs are verified, fall back from the AUR to Flathub when they need to, and land in a history you can read later.',
      'Helix Doctor checks the system and offers repairs, which you confirm one by one.',
      'Snapshots with Snapper or Timeshift, and Restic backups that are test-restored and checked against SHA-256 sums.',
      'Drift checks, moving a setup between distributions, firmware and hardware health, systemd services, Git repositories and Home Manager generations.',
      'A Ctrl-K command palette, a desktop window, and a command line where everything takes --dry-run and --json.',
    ],
    shots: [
      { src: toolboxDashboard, alt: 'Helix Toolbox dashboard in a terminal: system overview and quick actions' },
      { src: toolboxPlan, alt: 'The Install Plan listing each step with its risk before anything runs' },
      { src: toolboxApps, alt: 'Browsing the application catalog' },
      { src: toolboxDoctor, alt: 'Helix Doctor health checks' },
      { src: toolboxGui, alt: 'The Helix Toolbox desktop window' },
    ],
    install: [
      { title: 'Try it without installing', code: 'curl -fsSL https://raw.githubusercontent.com/Commanderx-code/Helix-toolbox/main/start.sh | sh' },
      { title: 'Arch', note: 'Download the package from the latest release, then:', code: 'sudo pacman -U helix-toolbox-*-x86_64.pkg.tar.zst' },
      { title: 'Debian and Ubuntu', code: 'sudo apt install ./helix-toolbox_*_amd64.deb' },
      { title: 'Fedora', code: 'sudo dnf install ./helix-toolbox-*.x86_64.rpm' },
      { title: 'Any distribution, with Cargo', code: 'cargo install --locked helix-toolbox' },
    ],
    docs: 'https://docs.helixtech.app/toolbox/walkthrough/',
  },
  {
    slug: 'boot',
    name: 'Helix Boot',
    category: 'Recovery',
    repo: 'Commanderx-code/helix-boot',
    pitch: 'A multiboot rescue USB that builds itself from upstream sources.',
    summary:
      'Current tools, verified downloads, a boot menu you can theme, and room for your own licensed software. Recovery, diagnostics and repair on one stick.',
    icon: bootIcon,
    platforms: 'Builds sticks on Windows and Linux; macOS can update an existing stick. Built on Ventoy, PhoenixPE and PortableApps.com.',
    license: 'MIT',
    features: [
      'Always current: every tool resolves to its latest upstream release each time you refresh.',
      'Verified: downloads are checked against the publisher’s checksum or GitHub’s digest, and anything without one is refused unless you trust it explicitly.',
      'Free tools by default, with slots for paid tools you bring yourself. Nothing is redistributed.',
      'Refresh updates the stick in place and keeps files you added; check reads it back for damaged files.',
      'Seven boot-menu themes, icon styles and your own background and splash, previewed before they are written.',
      'Offline packs: the whole stick in one zip that builds a new stick with no internet.',
      'Lazarus PE: your own Windows 11 PE with a full-screen tool launcher.',
      'Only USB disks are offered, and the device is checked again before each write.',
    ],
    shots: [
      { src: bootMenu, alt: 'The Helix Boot menu with tool categories over the Helix Neon theme' },
      { src: bootThemes, alt: 'The boot-menu themes side by side' },
      { src: bootLazarus, alt: 'The Lazarus PE tool launcher on Windows PE' },
      { src: bootWindows, alt: 'The Helix Boot app on Windows' },
    ],
    install: [
      {
        title: 'Download',
        note: 'From the latest release: HelixBoot.exe for Windows, HelixBoot-linux-x86_64 or HelixBoot.sh for Linux, or HelixBoot-mac-arm64 and HelixBoot-mac-x86_64 to update a stick on macOS.',
        code: 'chmod +x HelixBoot.sh && ./HelixBoot.sh',
      },
      {
        title: 'From a clone',
        note: 'Needs Python 3.11.4 or later and sudo.',
        code: 'git clone https://github.com/Commanderx-code/helix-boot\ncd helix-boot\n./install.sh      # download and verify, pick a stick, type its name to confirm\n./refresh.sh      # later: update the stick in place\n./check.sh        # read the stick back: any damaged files?',
      },
    ],
    docs: 'https://docs.helixtech.app/boot/',
  },
  {
    slug: 'config-bible',
    name: 'Config Bible',
    category: 'Documentation',
    availability: 'Not public yet. The repository is private while the handbook is personal; this page will link to it once it opens.',
    pitch: 'A handbook for your own workstation, with search, in a web site and a desktop app.',
    summary:
      'One folder of Markdown pages behind two viewers: a searchable web site and a desktop app with a command palette, live reload and pages you can mark as checked.',
    highlights: [
      'Ctrl-K palette, search, pins and backlinks',
      'Live reload: edited pages show without a rebuild',
      'Checks links and metadata so stale pages stand out',
    ],
    icon: bibleIcon,
    platforms: 'Linux. The desktop app is a Tauri app, packaged for Arch.',
    features: [
      'The same Markdown source behind a MkDocs Material site and a desktop app.',
      'A Ctrl-K command palette, search across the handbook, find on page, back and forward, breadcrumbs, pins, recent pages, tags and backlinks.',
      'Live reload: an edited page shows without a rebuild.',
      'Open a page in Neovim, jump to the file it describes, or mark it verified today.',
      'Checks every page’s metadata, links and code blocks, so stale pages stand out.',
      'Colors follow your desktop theme.',
    ],
    shots: [],
    install: [],
  },
  {
    slug: 'webos-launcher',
    name: 'webOS Launcher',
    category: 'TV',
    repo: 'Commanderx-code/webos-launcher',
    pitch: 'A minimal home screen for LG webOS TVs.',
    summary:
      'Favorites, Plex rows, inputs, moving themes and a screensaver, made for a stock TV in Developer Mode (webOS 5 and later). Plain HTML, CSS and JavaScript.',
    highlights: [
      'Favorites, Plex rows and named inputs',
      'Six moving themes, or your own wallpaper',
      'Syncs and updates itself every hour',
    ],
    icon: webosIcon,
    platforms: 'An LG TV with webOS 5 or later in Developer Mode, or rooted with Homebrew Channel. Node.js 20 or later on a computer on the same network.',
    license: 'MIT',
    features: [
      'Weather and clock, a Favorites row, and recently used apps on rooted TVs.',
      'Plex rows: Continue Watching, Recently Added, and Watchlist on rooted TVs.',
      'All Apps you can rearrange and hide. Inputs show only what is plugged in, named after the device.',
      'Themes: Ambient, Aurora, Midnight, Ocean, Sunset and Starry space, or your own picture or video wallpaper.',
      'Icons as the apps ship them, or glass tiles in white, brand color or ice blue.',
      'A screensaver with clock and weather over your photos and videos, or Plex art.',
      'Syncs and updates itself every hour.',
      'On rooted TVs: a phone remote page, commercial mute, layout backup and app updates.',
    ],
    shots: [],
    install: [
      {
        title: 'Connect the TV',
        note: 'Turn on Developer Mode and Key Server on the TV first. Use your TV’s address, and the passphrase Developer Mode shows.',
        code: 'git clone https://github.com/Commanderx-code/webos-launcher\ncd webos-launcher\nnpm install\nnpx ares-setup-device -a tv -i "host=192.168.1.50" -i "port=9922" -i "username=prisoner"\nnpx ares-novacom -d tv --getkey\nnpx ares-setup-device -m tv -i "privatekey=tv_webos" -i "passphrase=XXXXXX"',
      },
      { title: 'Sign in to Plex', code: 'npm run plex-login' },
      {
        title: 'Install it',
        note: 'The TV asks once to allow the connection; accept it with the remote.',
        code: 'npm run sync\nnpm run deploy',
      },
    ],
    docs: 'https://docs.helixtech.app/webos-launcher/',
  },
  {
    slug: 'touchdown',
    name: 'Touchdown',
    category: 'Game day',
    repo: 'Commanderx-code/touchdown-cli',
    pitch: 'Live NFL scores and stats in your terminal.',
    summary:
      'A keyboard-driven dashboard for game day: live, final and upcoming games, your team’s season at a glance, and a game center with box scores and play-by-play.',
    icon: tdIcon,
    platforms: 'Linux, macOS and Windows. Prebuilt binaries come with SHA-256 sums; building needs Go 1.24 or later.',
    license: 'MIT',
    features: [
      'A scores dashboard with live, final and upcoming games, a card for your team, and standings on wide terminals.',
      'Your team’s view: next matchup, latest result, bye week, schedule, record and stat leaders.',
      'A game center with box scores, player stats, play-by-play, quarter scores, scoring plays and drives.',
      'Follow any team, in one of three themes: mint, amber or mono.',
      'Optional desktop alerts when your team scores.',
      'Keeps working offline from cached results, marked as cached.',
      'td -once prints the scores once and exits, for scripts and status bars.',
    ],
    shots: [
      { src: tdDashboard, alt: 'Touchdown scores dashboard with live games, a team card and standings' },
      { src: tdGame, alt: 'The game center with box score and play-by-play' },
      { src: tdSeason, alt: 'A team’s season: schedule, record and stat leaders' },
    ],
    install: [
      { title: 'Download', note: 'Get the Linux, macOS or Windows archive from the latest release, check it against the SHA-256 file, and put touchdown (touchdown.exe on Windows) somewhere on your PATH.' },
      { title: 'From a clone', code: 'git clone https://github.com/Commanderx-code/touchdown-cli.git\ncd touchdown-cli\nmake install\ntd' },
      { title: 'Pick your team', code: 'td -set-favorite BUF' },
    ],
    docs: 'https://docs.helixtech.app/touchdown/',
  },
];

export interface Release {
  tag: string;
  date: string;
  url: string;
}

/** A GET from the GitHub API at build time; undefined when it fails. */
async function github(path: string): Promise<any> {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
  // From .env in development, from the environment in CI
  const token = import.meta.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const res = await fetch(`https://api.github.com/${path}`, { headers, signal: AbortSignal.timeout(10_000) });
    return res.ok ? await res.json() : undefined;
  } catch {
    return undefined;
  }
}

/** How many items a paged GitHub listing holds, from its last page number; undefined when it fails. */
async function githubCount(path: string): Promise<number | undefined> {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
  const token = import.meta.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const res = await fetch(`https://api.github.com/${path}?per_page=1`, { headers, signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return undefined;
    const last = res.headers.get('link')?.match(/[?&]page=(\d+)>; rel="last"/);
    if (last) return Number(last[1]);
    const list = await res.json();
    return Array.isArray(list) ? list.length : undefined;
  } catch {
    return undefined;
  }
}

/** Latest release of each public repository, read from GitHub at build time. */
export async function latestRelease(repo?: string): Promise<Release | undefined> {
  if (!repo) return undefined;
  const r = await github(`repos/${repo}/releases/latest`);
  return r && { tag: r.tag_name, date: r.published_at, url: r.html_url };
}

export interface ReleaseNote extends Release {
  name: string;
  /** The notes, as Markdown */
  body: string;
  prerelease: boolean;
}

/** The newest published releases of a public repository, newest first, read at build time. */
export async function releaseNotes(repo?: string, count = 3): Promise<ReleaseNote[]> {
  if (!repo) return [];
  const list = await github(`repos/${repo}/releases?per_page=${count + 2}`);
  if (!Array.isArray(list)) return [];
  return list
    .filter((r: any) => !r.draft)
    .slice(0, count)
    .map((r: any) => ({
      tag: r.tag_name,
      date: r.published_at,
      url: r.html_url,
      name: r.name || r.tag_name,
      body: r.body ?? '',
      prerelease: r.prerelease,
    }));
}

export interface RepoStats {
  stars: number;
  releases: number;
  /** Commits on the default branch */
  commits: number;
  /** Downloads of every file attached to every release */
  downloads: number;
}

/** Stars, releases, commits and release downloads of a public repository, read at build time. */
export async function repoStats(repo?: string): Promise<RepoStats | undefined> {
  if (!repo) return undefined;
  const [info, releases, commits] = await Promise.all([
    github(`repos/${repo}`),
    github(`repos/${repo}/releases?per_page=100`),
    githubCount(`repos/${repo}/commits`),
  ]);
  if (!info || !Array.isArray(releases)) return undefined;
  return {
    stars: info.stargazers_count,
    releases: releases.length,
    commits: commits ?? 0,
    downloads: releases.reduce(
      (sum: number, r: any) => sum + r.assets.reduce((n: number, a: any) => n + a.download_count, 0),
      0,
    ),
  };
}
