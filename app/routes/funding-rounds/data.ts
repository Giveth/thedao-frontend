export type RoundStatus = 'Open Round' | 'Closed' | 'Coming Soon';

export type Round = {
  id: number;
  title: string;
  description: string;
  pool: string;
  /** Round window as ISO dates (YYYY-MM-DD). Omit both when the round is still TBD. */
  startDate?: string;
  endDate?: string;
  image: string;
  /** Canonical URL to share for this round. Omit to hide the share button. */
  shareUrl?: string;
};

export const rounds: Round[] = [
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
  },
  {
    id: 2,
    title: 'TBD - Coming late summer',
    description: '',
    pool: 'TBC',
    image: '/funding-rounds/coming-soon.webp',
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
  if (!round.startDate || !round.endDate) return 'Coming Soon';

  const start = parseDate(round.startDate);
  const end = parseDate(round.endDate);
  end.setUTCHours(23, 59, 59, 999); // the round is open through the whole end day

  if (now < start) return 'Coming Soon';
  if (now > end) return 'Closed';
  return 'Open Round';
}

/** Human-readable date range, e.g. "April 23 – May 14, 2026". */
export function getRoundDeadline(round: Round): string {
  if (!round.startDate || !round.endDate) return 'TBA';

  const start = parseDate(round.startDate);
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
    return `${intro} The ${open.title} round on Giveth has a ${open.pool} matching pool, open ${getRoundDeadline(open)}.`;
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
