import { memo } from 'react';
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
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50 dark:bg-slate-900">
            {/* Mobile Header */}
            <header className="bg-white dark:bg-slate-800 p-4 flex items-center justify-between lg:hidden shadow-md z-10 sticky top-0">
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                >
                    <span className="sr-only">Open sidebar</span>
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 6h16M4 12h16M4 18h16"
                        ></path>
                    </svg>
                </button>
                <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    FFXI GP Calculator
                </h1>
                <div className="w-8"></div>
            </header>

            {/* Scrollable Container (Full Width) */}
            <div
                id="main-scroll-container"
                className="flex-1 overflow-y-auto scroll-smooth"
                onScroll={() => {
                    if (!isProgrammaticScroll.current) {
                        const url = new URL(window.location.href);
                        if (url.searchParams.has('guild')) {
                            updateUrl({ guild: '' }, true);
                        }
                    }
                }}
            >
                {/* Centered Content Wrapper */}
                <main className="p-4 md:p-8 md:max-w-6xl mx-auto w-full">
                    {guildData ? (
                        <div className="flex flex-col space-y-8 pb-24">
                            {targetGuilds.map((guildId) => {
                                const gName = GUILDS[guildId as keyof typeof GUILDS];
                                const gData =
                                    guildData[guildId.toString()]?.[pattern.toString()];

                                return (
                                    <div
                                        key={guildId}
                                        id={`guild-${guildId}`}
                                        className="relative bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
                                    >
                                        <div
                                            className="p-5 border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                            onClick={() => onGuildHeaderClick(guildId)}
                                            title="Click to anchor URL to this guild"
                                        >
                                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center">
                                                <span className="w-1.5 h-6 bg-blue-500 rounded-full mr-3"></span>
                                                {gName}
                                            </h3>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left whitespace-nowrap">
                                                <caption className="sr-only">
                                                    {gName} Guild Points
                                                </caption>
                                                <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold tracking-wider border-b border-slate-100 dark:border-slate-700">
                                                    <tr>
                                                        <th className="px-6 py-3">Rank</th>
                                                        <th className="px-6 py-3">Item</th>
                                                        <th className="px-6 py-3 text-right">Points</th>
                                                        <th className="px-6 py-3 text-right">Max</th>
                                                        <th className="px-6 py-3 text-right">Qty</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                                    {SKILL_RANKS.slice(3).map((rank) => {
                                                        const rotationCounter = earthDays % (rank.id + 1);
                                                        const items =
                                                            gData?.[rotationCounter.toString()] || [];

                                                        if (items.length === 0) {
                                                            return (
                                                                <tr
                                                                    key={rank.id}
                                                                    className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                                                                >
                                                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200">
                                                                        {rank.name}
                                                                    </td>
                                                                    <td
                                                                        colSpan={4}
                                                                        className="px-6 py-4 text-slate-400 dark:text-slate-500 italic text-xs"
                                                                    >
                                                                        No active item
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }

                                                        return items.map(
                                                            (item: GuildItem, index: number) => (
                                                                <tr
                                                                    key={item.id}
                                                                    className={`hover:bg-blue-50/40 dark:hover:bg-blue-900/20 transition-colors ${index !== items.length - 1 ? 'border-b-0' : ''}`}
                                                                >
                                                                    {index === 0 && (
                                                                        <td
                                                                            className="px-6 py-3 font-medium text-slate-600 dark:text-slate-300 bg-slate-50/30 dark:bg-slate-900/20 border-r border-slate-50 dark:border-slate-700 align-top"
                                                                            rowSpan={items.length}
                                                                        >
                                                                            {rank.name}
                                                                        </td>
                                                                    )}
                                                                    <td className="px-6 py-3 font-medium text-slate-800 dark:text-slate-100">
                                                                        {item.name}
                                                                    </td>
                                                                    <td className="px-6 py-3 text-right text-slate-600 dark:text-slate-300">
                                                                        {item.points.toLocaleString()}
                                                                    </td>
                                                                    {index === 0 && (
                                                                        <td
                                                                            className="px-6 py-3 text-right border-l border-slate-50 dark:border-slate-700 align-top font-semibold text-slate-700 dark:text-slate-200"
                                                                            rowSpan={items.length}
                                                                        >
                                                                            {item.max.toLocaleString()}
                                                                        </td>
                                                                    )}
                                                                    <td className="px-6 py-3 text-right">
                                                                        <span className="inline-block bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold px-2 py-0.5 rounded-full">
                                                                            {Math.ceil(item.max / item.points)}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            ),
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col space-y-8 pb-24">
                            {targetGuilds.map((id) => (
                                <SkeletonTable key={id} />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
});

export default GuildList;
