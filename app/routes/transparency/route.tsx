import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import TextType from '~/components/text-animations/TextType';
import { projectStreamedEth, useNow, useSealStreams } from '~/hooks/useSealStreams';
import { generateMeta } from '~/utils/meta';
import {
  getGrantsTotalEth,
  getGrantsTotalUsd,
  getMetaDescription,
  LAST_UPDATED,
  projects,
  SNAPSHOT_TIMESTAMP,
  USD_PER_ETH_STREAMED,
} from './data';
import HeroStats from './HeroStats';
import ProjectModal from './ProjectModal';
import ProjectsTable, { type RankedProject } from './ProjectsTable';

export function meta() {
  return generateMeta({
    title: 'Transparency',
    description: getMetaDescription(),
    url: '/transparency',
  });
}

// Hoisted so the references stay stable across the page's per-second re-renders
// (useNow ticker); a fresh array each render resets TextType's typing timers and
// freezes the animation after the first word.
const HERO_TEXTS = ['BACK.', 'TRANSPARENT.', 'ACCOUNTABLE.', 'ON-CHAIN.'];
const HERO_TEXT_COLORS = [
  'var(--color-dao-red)',
  'var(--color-dao-green)',
  'var(--color-dao-red)',
  'var(--color-dao-green)',
];

export default function Transparency() {
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const { streams } = useSealStreams();
  const now = useNow(1000);

  // Before the client clock starts (and in prerendered HTML), streamed
  // amounts are rendered as of the CSV snapshot so hydration matches.
  const nowMs = now ?? SNAPSHOT_TIMESTAMP * 1000;

  const rankedProjects: RankedProject[] = useMemo(
    () =>
      projects
        .map((project) => {
          const streamedEth = projectStreamedEth(project.name, streams, nowMs);
          return {
            ...project,
            displayTotalEth: project.totalEth + getGrantsTotalEth(project.name) + streamedEth,
            displayUsdSent:
              project.usdSent + getGrantsTotalUsd(project.name) + streamedEth * USD_PER_ETH_STREAMED,
          };
        })
        .sort((a, b) => b.displayTotalEth - a.displayTotalEth),
    [streams, nowMs],
  );

  const sentEth = useMemo(
    () => rankedProjects.reduce((sum, p) => sum + p.displayTotalEth, 0),
    [rankedProjects],
  );

  const sentUsd = useMemo(
    () => rankedProjects.reduce((sum, p) => sum + p.displayUsdSent, 0),
    [rankedProjects],
  );

  const selectedProject = selectedName
    ? rankedProjects.find((p) => p.name === selectedName) ?? null
    : null;

  return (
    <>
      <section
        className="relative min-h-screen overflow-hidden pt-32 pb-[120px]"
        style={{ backgroundImage: 'linear-gradient(142.716deg, rgb(44, 94, 134) 31.459%, rgb(31, 67, 95) 90.396%)' }}
      >
        <div className="relative z-10 max-w-[1100px] mx-auto px-6">
          <Header
            title="TheDAO is Transparent"
            subtitle="Every ETH we send to Ethereum security is public, verifiable, and tracked on-chain."
          />

          <HeroStats sentEth={sentEth} sentUsd={sentUsd} />

          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">Who we funded</h2>
              <p className="text-white/60">
                Click a project to see the full breakdown of every payment it received.
              </p>
            </div>
            <div className="relative md:w-72 shrink-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 z-10 w-4 h-4 text-white/40" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects…"
                aria-label="Search projects"
                className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl pl-9 pr-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-[#00ff88]/50 transition-colors duration-200"
              />
            </div>
          </div>
          <ProjectsTable
            rankedProjects={rankedProjects}
            query={query}
            onSelect={(project) => setSelectedName(project.name)}
          />

          <ProjectModal
            project={selectedProject}
            streamedEth={
              selectedProject ? projectStreamedEth(selectedProject.name, streams, nowMs) : 0
            }
            onClose={() => setSelectedName(null)}
          />

          <h2 className="mt-24 text-3xl md:text-4.5xl lg:text-6xl font-normal text-white tracking-tight leading-none font-inter text-center">
            THE DAO IS
            <br className="sm:hidden" />
            <span className="hidden sm:inline">{' '}</span>
            {/* Invisible cursor balancer - offsets the visible cursor's width on extra small screens for proper centering */}
            <span className="inline-block mr-1 opacity-0 sm:hidden" aria-hidden="true">|</span>
            <TextType
              text={HERO_TEXTS}
              as="span"
              typingSpeed={190}
              deletingSpeed={50}
              pauseDuration={1500}
              showCursor
              cursorCharacter="|"
              loop
              textColors={HERO_TEXT_COLORS}
            />
          </h2>

          <p className="mt-16 text-center text-sm text-white/40">
            Last updated {LAST_UPDATED} · streamed amounts update live from Ethereum mainnet
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
