import { ExternalLink, Megaphone } from 'lucide-react';
import { type Project } from './data';
import { formatEth, formatUsd } from './format';

export type RankedProject = Project & {
  /** Round total + direct grants + streamed so far (for SEAL projects). */
  displayTotalEth: number;
  /** Frozen round USD + frozen grant USD + streamed USD (for SEAL projects). */
  displayUsdSent: number;
};

export default function ProjectsTable({
  rankedProjects,
  query = '',
  onSelect,
}: {
  rankedProjects: RankedProject[];
  /** Filters rows by recipient name; ranks stay those of the full list. */
  query?: string;
  onSelect: (project: RankedProject) => void;
}) {
  const needle = query.trim().toLowerCase();
  // Below md the table collapses to three columns: rank, recipient (with the
  // progress-update link inline) and ETH with the USD value as a subline.
  const visibleProjects = rankedProjects
    .map((project, rank) => ({ project, rank }))
    .filter(({ project }) => !needle || project.name.toLowerCase().includes(needle));

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto max-h-[640px] overflow-y-auto">
        <table className="w-full table-fixed text-[15px] md:text-base">
          <thead className="sticky top-0 z-10">
            <tr className="bg-dao-blue text-left text-xs uppercase tracking-wider text-white/60 font-inter-tight">
              <th className="pl-3 pr-1 md:px-4 py-3 font-medium w-8 md:w-10">#</th>
              <th className="px-3 md:px-4 py-3 font-medium">Recipient</th>
              <th className="px-3 md:px-4 py-3 font-medium text-right whitespace-nowrap w-28 md:w-32">
                Total (ETH)
              </th>
              <th className="hidden md:table-cell px-4 py-3 font-medium text-right whitespace-nowrap w-32">
                USD when sent
              </th>
              <th className="hidden md:table-cell px-4 py-3 font-medium text-center whitespace-nowrap w-40">
                Progress update
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleProjects.map(({ project, rank }) => {
              const nameWords = project.name.split(' ');
              const lastWord = nameWords.pop();
              const leadingName = nameWords.join(' ');
              const progressLink = (className: string) =>
                project.progressUpdate && (
                  <a
                    href={project.progressUpdate}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Progress update from ${project.name}`}
                    title="Progress update"
                    className={`inline-block align-[center] text-white/50 hover:text-[#00ff88] transition-colors duration-200 ${className}`}
                  >
                    <Megaphone className="w-4 h-4 inline-block" />
                  </a>
                );
              return (
                <tr
                  key={project.name}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelect(project)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelect(project);
                    }
                  }}
                  className="border-t border-white/5 cursor-pointer transition-colors duration-150 hover:bg-[#00ff88]/5 focus:bg-[#00ff88]/5 focus:outline-none"
                >
                  <td className="pl-3 pr-1 md:px-4 py-3 text-white/40 tabular-nums">{rank + 1}</td>
                  <td className="px-3 md:px-4 py-3 text-white">
                    {leadingName && `${leadingName} `}
                    <span className="whitespace-nowrap">
                      {lastWord}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Visit ${project.name}`}
                          title={project.link}
                          className="ml-1 inline-block align-[center] text-white/30 hover:text-[#00ff88] transition-colors duration-200"
                        >
                          <ExternalLink className="w-3.5 h-3.5 inline-block" />
                        </a>
                      )}
                      {progressLink('ml-1.5 md:hidden')}
                    </span>
                  </td>
                  <td className="px-3 md:px-4 py-3 text-right text-white/70 tabular-nums whitespace-nowrap">
                    {formatEth(project.displayTotalEth)}
                    <span className="block md:hidden text-xs text-white/40">
                      {formatUsd(project.displayUsdSent)}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-4 py-3 text-right text-white/70 tabular-nums whitespace-nowrap">
                    {formatUsd(project.displayUsdSent)}
                  </td>
                  <td className="hidden md:table-cell px-4 py-3 text-center">{progressLink('')}</td>
                </tr>
              );
            })}
            {visibleProjects.length === 0 && (
              <tr className="border-t border-white/5">
                <td colSpan={5} className="px-4 py-8 text-center text-white/50">
                  No projects match “{query.trim()}”
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="px-4 py-3 border-t border-white/10 text-sm text-white/50">
        {needle
          ? `${visibleProjects.length} of ${rankedProjects.length} recipients`
          : <>{rankedProjects.length} recipients - SEAL &amp; SEAL911 stream live via Superfluid.</>}
      </p>
    </div>
  );
}
