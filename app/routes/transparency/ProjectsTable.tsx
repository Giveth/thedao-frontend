import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { SEAL_ONCHAIN, type Project } from './data';
import { formatEth, formatUsd } from './format';

export type RankedProject = Project & {
  /** Round total + direct grants + streamed so far (for SEAL projects). */
  displayTotalEth: number;
  /** Frozen round USD + frozen grant USD + streamed USD (for SEAL projects). */
  displayUsdSent: number;
};

export default function ProjectsTable({
  rankedProjects,
  onSelect,
}: {
  rankedProjects: RankedProject[];
  onSelect: (project: RankedProject) => void;
}) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto max-h-[640px] overflow-y-auto">
        <table className="w-full table-fixed text-[15px] md:text-base">
          <thead className="sticky top-0 z-10">
            <tr className="bg-dao-blue text-left text-xs uppercase tracking-wider text-white/60 font-inter-tight">
              <th className="px-4 py-3 font-medium w-10">#</th>
              <th className="px-4 py-3 font-medium">Recipient</th>
              <th className="px-4 py-3 font-medium text-right whitespace-nowrap w-32">Total (ETH)</th>
              <th className="px-4 py-3 font-medium text-right whitespace-nowrap w-32">USD when sent</th>
            </tr>
          </thead>
          <tbody>
            {rankedProjects.map((project, i) => {
              const isStreaming = project.name in SEAL_ONCHAIN;
              const nameWords = project.name.split(' ');
              const lastWord = nameWords.pop();
              const leadingName = nameWords.join(' ');
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
                  <td className="px-4 py-3 text-white/40">{i + 1}</td>
                  <td className="px-4 py-3 text-white">
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
                      {isStreaming && (
                        <span className="ml-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] uppercase tracking-wider bg-[rgba(92,183,90,0.15)] text-dao-green align-[center]">
                          <motion.span
                            className="w-1.5 h-1.5 rounded-full inline-block bg-dao-green"
                            animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                          />
                          live
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-dao-green tabular-nums whitespace-nowrap">
                    {formatEth(project.displayTotalEth)}
                  </td>
                  <td className="px-4 py-3 text-right text-white/70 tabular-nums whitespace-nowrap">
                    {formatUsd(project.displayUsdSent)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="px-4 py-3 border-t border-white/10 text-sm text-white/50">
        {rankedProjects.length} recipients (click row for full breakdown)
      </p>
    </div>
  );
}
