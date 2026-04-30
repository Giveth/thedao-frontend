export type Round = {
  id: number;
  status: 'Open Round' | 'Coming Soon';
  title: string;
  description: string;
  pool: string;
  deadline: string;
  image: string;
  /** Canonical URL to share for this round. Omit to hide the share button. */
  shareUrl?: string;
};

export const rounds: Round[] = [
  {
    id: 1,
    status: 'Open Round',
    title: 'Ethereum Security',
    description:
      'A quadratic funding round on Giveth with a 500 ETH matching pool scoped broadly to support any project providing a public benefit to Ethereum security.',
    pool: '500 ETH',
    deadline: 'April 23 – May 14, 2026',
    image: '/funding-rounds/ethsecurity-round.webp',
    shareUrl: 'https://qf.giveth.io/qf/ethereum-security',
  },
  {
    id: 2,
    status: 'Coming Soon',
    title: 'TBD - Coming late summer',
    description: '',
    pool: 'TBC',
    deadline: 'TBA',
    image: '/funding-rounds/coming-soon.webp',
  },
];
