import { useMemo, useState } from 'react';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
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

export default function Transparency() {
  const [selectedName, setSelectedName] = useState<string | null>(null);
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
            title="Accountable. On-Chain."
            subtitle="Every ETH we send to Ethereum security is public, verifiable, and tracked on-chain."
          />

          <HeroStats sentEth={sentEth} sentUsd={sentUsd} />

          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">Who we funded</h2>
          <ProjectsTable
            rankedProjects={rankedProjects}
            onSelect={(project) => setSelectedName(project.name)}
          />

          <ProjectModal
            project={selectedProject}
            streamedEth={
              selectedProject ? projectStreamedEth(selectedProject.name, streams, nowMs) : 0
            }
            onClose={() => setSelectedName(null)}
          />

          <p className="mt-16 text-center text-sm text-white/40">
            Last updated {LAST_UPDATED} · streamed amounts update live from Ethereum mainnet
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
