import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGuildScroll } from '../hooks/useGuildScroll';
import { GuildData, GuildItem } from '../types/guild';
import { GUILDS, SKILL_RANKS } from '../constants';
import { useStore } from '../store/useStore';
import SkeletonTable from './ui/SkeletonTable';

interface GuildListProps {
    guildData: GuildData | null;
    targetGuilds: number[];
    pattern: number;
    earthDays: number;
    onGuildHeaderClick: (id: number) => void;
    isProgrammaticScroll: React.MutableRefObject<boolean>;
    updateUrl: (params: Record<string, string>, replace?: boolean) => void;
}

const GuildList = memo(function GuildList({
    guildData,
    targetGuilds,
    pattern,
    earthDays,
    onGuildHeaderClick,
    isProgrammaticScroll,
    updateUrl,
}: GuildListProps) {
    const { setIsSidebarOpen } = useStore();

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-900">
            <div
                id="main-scroll-container"
                className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar"
                onScroll={() => {
                    if (!isProgrammaticScroll.current) {
                        const url = new URL(window.location.href);
                        if (url.searchParams.has('guild')) {
                            updateUrl({ guild: '' }, true);
                        }
                    }
                }}
            >
                {/* Mobile Header */}
                <header className="bg-white dark:bg-slate-800 p-4 flex items-center justify-between lg:hidden shadow-md z-50 sticky top-0">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                    >
                        <span className="sr-only">Open sidebar</span>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                    <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">FFXI GP Calculator</h1>
                    <div className="w-8"></div>
                </header>

                <main className="p-4 md:p-8 md:max-w-6xl mx-auto w-full">
                    <motion.div layout className="flex flex-col space-y-8 pb-24">
                        {targetGuilds.map((guildId) => {
                            const gName = GUILDS[guildId as keyof typeof GUILDS];
                            const gData = guildData ? guildData[guildId.toString()]?.[pattern.toString()] : null;

                            return (
                                <motion.div
                                    key={guildId}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    id={`guild-${guildId}`}
                                    className="relative bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden transition-colors"
                                >
                                    <div
                                        className="p-5 border-b border-slate-100 dark:border-white/5 bg-white dark:bg-slate-800 flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                        onClick={() => onGuildHeaderClick(guildId)}
                                    >
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center">
                                            <span className="w-1.5 h-6 bg-blue-500 rounded-full mr-3"></span>
                                            {gName}
                                        </h3>
                                    </div>

                                    <div className="overflow-x-auto -mx-1 sm:mx-0">
                                        {!gData ? (
                                            <SkeletonTable />
                                        ) : (
                                            <table className="w-full text-[10px] sm:text-sm text-left">
                                                <caption className="sr-only">{gName} Guild Points</caption>
                                                <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-[9px] sm:text-[10px] uppercase font-bold tracking-tighter sm:tracking-widest border-b border-slate-100 dark:border-white/5">
                                                    <tr>
                                                        <th className="pl-3 pr-2 sm:px-4 lg:px-6 py-2.5 sm:py-4">Rank</th>
                                                        <th className="px-2 sm:px-4 lg:px-6 py-2.5 sm:py-4">Item</th>
                                                        <th className="px-2 sm:px-4 lg:px-6 py-2.5 sm:py-4 text-right">Pts</th>
                                                        <th className="px-2 sm:px-4 lg:px-6 py-2.5 sm:py-4 text-right">Max</th>
                                                        <th className="pl-2 pr-3 sm:px-4 lg:px-6 py-2.5 sm:py-4 text-right">Qty</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 dark:divide-white/5 relative">
                                                    <AnimatePresence mode="popLayout" initial={false}>
                                                        {(() => {
                                                            const flatRows = SKILL_RANKS.slice(3).flatMap((rank) => {
                                                                const rotationCounter = earthDays % (rank.id + 1);
                                                                const items = gData?.[rotationCounter.toString()] || [];
                                                                const rankKey = `row-${earthDays}-${rank.id}`;

                                                                // Abbreviate ranks for mobile
                                                                const shortRankName = rank.name === 'Journeyman' ? 'Jour.' :
                                                                    rank.name === 'Apprentice' ? 'Appr.' :
                                                                        rank.name === 'Craftsman' ? 'Craft.' :
                                                                            rank.name === 'Initiate' ? 'Init.' :
                                                                                rank.name === 'Veteran' ? 'Vet.' :
                                                                                    rank.name === 'Artisan' ? 'Art.' : rank.name;

                                                                if (items.length === 0) {
                                                                    return [
                                                                        <motion.tr
                                                                            key={`${rankKey}-empty`}
                                                                            initial={{ opacity: 0 }}
                                                                            animate={{ opacity: 1 }}
                                                                            exit={{ opacity: 0 }}
                                                                            className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                                                                        >
                                                                            <td className="pl-3 pr-2 sm:px-4 lg:px-6 py-2.5 sm:py-4 font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                                                                <span className="sm:hidden">{shortRankName}</span>
                                                                                <span className="hidden sm:inline">{rank.name}</span>
                                                                            </td>
                                                                            <td colSpan={4} className="pl-2 pr-3 sm:px-4 lg:px-6 py-2.5 sm:py-4 text-slate-400 dark:text-slate-600 italic text-[10px]">
                                                                                No active item
                                                                            </td>
                                                                        </motion.tr>
                                                                    ];
                                                                }

                                                                return items.map((item: GuildItem, index: number) => (
                                                                    <motion.tr
                                                                        key={`${rankKey}-${item.id}-${index}`}
                                                                        initial={{ opacity: 0, x: -10 }}
                                                                        animate={{ opacity: 1, x: 0 }}
                                                                        exit={{ opacity: 0, x: 10 }}
                                                                        transition={{ duration: 0.2 }}
                                                                        className={`group hover:bg-blue-50/40 dark:hover:bg-blue-900/10 transition-colors`}
                                                                    >
                                                                        {index === 0 && (
                                                                            <td
                                                                                className="pl-3 pr-2 sm:px-4 lg:px-6 py-2.5 sm:py-4 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/30 dark:bg-slate-900/20 border-r border-slate-50 dark:border-white/5 align-top whitespace-nowrap"
                                                                                rowSpan={items.length}
                                                                            >
                                                                                <span className="sm:hidden">{shortRankName}</span>
                                                                                <span className="hidden sm:inline">{rank.name}</span>
                                                                            </td>
                                                                        )}
                                                                        <td className="px-2 sm:px-4 lg:px-6 py-2.5 sm:py-4 font-semibold text-slate-700 dark:text-slate-200 whitespace-normal min-w-[40px] leading-tight">
                                                                            {item.name}
                                                                        </td>
                                                                        <td className="px-2 sm:px-4 lg:px-6 py-2.5 sm:py-4 text-right text-slate-500 dark:text-slate-400 font-mono whitespace-nowrap">
                                                                            {item.points.toLocaleString()}
                                                                        </td>
                                                                        {index === 0 && (
                                                                            <td
                                                                                className="px-2 sm:px-4 lg:px-6 py-2.5 sm:py-4 text-right border-l border-slate-50 dark:border-white/5 align-top font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap"
                                                                                rowSpan={items.length}
                                                                            >
                                                                                {item.max.toLocaleString()}
                                                                            </td>
                                                                        )}
                                                                        <td className="pl-2 pr-3 sm:px-4 lg:px-6 py-2.5 sm:py-4 text-right whitespace-nowrap">
                                                                            <span className="inline-block bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-[10px] font-black px-1.5 py-0.5 rounded-full border border-blue-100 dark:border-blue-800/30">
                                                                                {Math.ceil(item.max / item.points)}
                                                                            </span>
                                                                        </td>
                                                                    </motion.tr>
                                                                ));
                                                            });
                                                            return flatRows;
                                                        })()}
                                                    </AnimatePresence>
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </main>
            </div>
        </div>
    );
});

export default GuildList;
