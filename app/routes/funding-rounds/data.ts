export type RoundStatus = 'Open Round' | 'Closed' | 'Coming Soon';

export type Round = {
  id: number;
  title: string;
  description: string;
  /** Matching pool size. Omit when not yet announced. */
  pool?: string;
  /** Round window as ISO dates (YYYY-MM-DD). Omit both when the round is still TBD; omit only endDate for an open-ended round. */
  startDate?: string;
  endDate?: string;
  /** Force a status instead of deriving it from the dates (e.g. a live round with no fixed window). */
  status?: RoundStatus;
  image: string;
  /** Canonical URL to share for this round. Omit to hide the share button. */
  shareUrl?: string;
  /** Primary call to action, shown while the round is open. */
  cta?: { label: string; href: string };
  /** Secondary (outlined) call to action, shown next to the primary one while the round is open. */
  secondaryCta?: { label: string; href: string };
};

export const rounds: Round[] = [
  {
    id: 2,
    title: 'ETHSecurity Initiatives',
    description:
      'TheDAO Security Fund’s new round is focused on Ethereum security initiatives. Propose the work. Fund the work. Build the work.',
    startDate: '2026-09-15',
    image: '/funding-rounds/ethsecurity-initiatives.webp',
    cta: { label: 'Explore initiatives', href: 'https://initiatives.thedao.fund' },
    secondaryCta: {
      label: 'Learn more',
      href: 'https://paragraph.com/@thedao.fund/round-two-starts-today-ethsecurity-initiatives',
    },
  },
  {
    id: 1,
    title: 'Ethereum Security',
    description:
      'A quadratic funding round on Giveth with a 500 ETH matching pool scoped broadly to support any project providing a public benefit to Ethereum security.',
    pool: '500 ETH',
    startDate: '2026-04-23',
    endDate: '2026-05-14',
    image: '/funding-rounds/ethsecurity-round.webp',
    shareUrl: 'https://qf.giveth.io/qf/ethereum-security',
    cta: { label: 'Donate', href: 'https://qf.giveth.io/qf/ethereum-security' },
  },
];

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** Parse an ISO date as UTC midnight so the displayed day never shifts by timezone. */
function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/** Derive the round status from its dates relative to `now`. */
export function getRoundStatus(round: Round, now: Date = new Date()): RoundStatus {
  if (round.status) return round.status;
  if (!round.startDate) return 'Coming Soon';

  const start = parseDate(round.startDate);
  if (now < start) return 'Coming Soon';
  if (!round.endDate) return 'Open Round'; // open-ended

  const end = parseDate(round.endDate);
  end.setUTCHours(23, 59, 59, 999); // the round is open through the whole end day
  if (now > end) return 'Closed';
  return 'Open Round';
}

/** Human-readable date range, e.g. "April 23 – May 14, 2026", or "From September 15, 2026" when open-ended. */
export function getRoundDeadline(round: Round): string {
  if (!round.startDate) return 'TBA';

  const start = parseDate(round.startDate);
  if (!round.endDate) {
    return `From ${MONTHS[start.getUTCMonth()]} ${start.getUTCDate()}, ${start.getUTCFullYear()}`;
  }

  const end = parseDate(round.endDate);
  const startStr = `${MONTHS[start.getUTCMonth()]} ${start.getUTCDate()}`;
  const endStr = `${MONTHS[end.getUTCMonth()]} ${end.getUTCDate()}, ${end.getUTCFullYear()}`;

  return start.getUTCFullYear() === end.getUTCFullYear()
    ? `${startStr} – ${endStr}`
    : `${startStr}, ${start.getUTCFullYear()} – ${endStr}`;
}

/** SEO meta description reflecting the current state of the rounds. */
export function getRoundsMetaDescription(now: Date = new Date()): string {
  const intro =
    'TheDAO Security Fund Quadratic Funding rounds — supporting people and projects making Ethereum safer.';

  const open = rounds.find((r) => getRoundStatus(r, now) === 'Open Round');
  if (open) {
    const dates = !open.startDate
      ? 'open now'
      : open.endDate
        ? `open ${getRoundDeadline(open)}`
        : `open since ${getRoundDeadline(open).replace(/^From /, '')}`;
    const details = open.pool ? `has a ${open.pool} matching pool, ${dates}` : `is ${dates}`;
    return `${intro} The ${open.title} round ${details}.`;
  }

  const upcoming = rounds.find((r) => getRoundStatus(r, now) === 'Coming Soon' && r.startDate);
  if (upcoming) {
    return `${intro} The next round, ${upcoming.title}, opens ${getRoundDeadline(upcoming)}.`;
  }

  const closed = [...rounds].reverse().find((r) => getRoundStatus(r, now) === 'Closed');
  if (closed) {
    return `${intro} The ${closed.title} round on Giveth ran ${getRoundDeadline(closed)} with a ${closed.pool} matching pool. Stay tuned for upcoming rounds.`;
  }

  return intro;
}
