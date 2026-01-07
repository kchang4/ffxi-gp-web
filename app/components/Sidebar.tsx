import { GUILDS } from '../constants';
import { VanaTime } from '../hooks/useVanaTime';
import NumberInput from './ui/NumberInput';

interface SidebarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    currentVana: VanaTime;
    setDateToNow: () => void;
    vYear: number;
    setVYear: (y: number) => void;
    vMonth: number;
    setVMonth: (m: number) => void;
    vDay: number;
    setVDay: (d: number) => void;
    pattern: number;
    setPattern: (p: number) => void;
    targetGuilds: number[];
    selectedGuild: number | null;
    onGuildClick: (id: number) => void;
    earthDays: number;
}

export default function Sidebar({
    isSidebarOpen,
    setIsSidebarOpen,
    theme,
    toggleTheme,
    currentVana,
    setDateToNow,
    vYear, setVYear,
    vMonth, setVMonth,
    vDay, setVDay,
    pattern, setPattern,
    targetGuilds,
    selectedGuild,
    onGuildClick,
    earthDays
}: SidebarProps) {
    return (
        <>
            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Navigation */}
            <aside className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-white dark:bg-slate-800 shadow-2xl transform transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0 dark:border-r dark:border-white/5
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
                    <div className="p-6 flex justify-between items-center bg-white dark:bg-slate-800 shadow-sm z-10">
                        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">FFXI GP Calculator</h1>

                        <div className="flex items-center space-x-2">
                            {/* Theme Toggle Button */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 transition"
                                title="Toggle Theme"
                            >
                                {theme === 'dark' ? (
                                    // Sun Icon
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                ) : (
                                    // Moon Icon
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                                )}
                            </button>

                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="lg:hidden text-slate-500 hover:text-slate-700 font-bold text-xl dark:text-slate-400 dark:hover:text-slate-200"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8">

                        {/* 1. Date Picker */}
                        <section>
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-xs uppercase tracking-wider text-slate-500 font-bold">Vana'diel Date</h2>
                                {currentVana.vYear > 0 && (
                                    <button
                                        onClick={setDateToNow}
                                        className="text-white bg-slate-700 hover:bg-slate-600 transition p-1.5 rounded-full shadow-sm"
                                        title="Sync to Current Vana'diel Time"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Live Clock Widget */}
                            {currentVana.vYear > 0 && (
                                <div className="mb-5 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
                                    <div className="bg-slate-800 text-white p-3 text-center relative overflow-hidden">
                                        <div className="relative z-10 flex flex-col justify-center items-center">
                                            <span className="text-2xl font-mono font-bold tracking-widest leading-none">
                                                {String(currentVana.vHour).padStart(2, '0')}:{String(currentVana.vMinute).padStart(2, '0')}<span className="text-slate-400 text-base">:{String(currentVana.vSecond).padStart(2, '0')}</span>
                                            </span>
                                            <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">{currentVana.vDayOfWeek}</span>
                                        </div>
                                    </div>
                                    <div className="p-3 text-center bg-white">
                                        <div className="flex justify-center items-baseline space-x-1">
                                            <span className="text-xl font-bold text-slate-700">{currentVana.vYear}</span>
                                            <span className="text-slate-400">/</span>
                                            <span className="text-xl font-bold text-slate-700">{String(currentVana.vMonth).padStart(2, '0')}</span>
                                            <span className="text-slate-400">/</span>
                                            <span className="text-xl font-bold text-slate-700">{String(currentVana.vDay).padStart(2, '0')}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Calculator Inputs */}
                            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                                <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Target Date</p>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="col-span-1">
                                        <NumberInput
                                            label="Year"
                                            value={vYear}
                                            onChange={(e) => setVYear(Math.max(1, Number(e.target.value)))}
                                            min={1}
                                        />
                                    </div>
                                    <div>
                                        <NumberInput
                                            label="Month"
                                            value={vMonth}
                                            onChange={(e) => {
                                                const val = Number(e.target.value);
                                                if (val > 12) setVMonth(12);
                                                else if (val < 1 && e.target.value !== '') setVMonth(1);
                                                else setVMonth(val);
                                            }}
                                            min={1}
                                            max={12}
                                        />
                                    </div>
                                    <div>
                                        <NumberInput
                                            label="Day"
                                            value={vDay}
                                            onChange={(e) => {
                                                const val = Number(e.target.value);
                                                if (val > 30) setVDay(30);
                                                else if (val < 1 && e.target.value !== '') setVDay(1);
                                                else setVDay(val);
                                            }}
                                            min={1}
                                            max={30}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="border-t border-slate-200"></div>

                        {/* 2. Pattern Selection */}
                        <section>
                            <h2 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-3">Pattern</h2>
                            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                                <select
                                    value={pattern}
                                    onChange={e => setPattern(Number(e.target.value))}
                                    className="w-full border-slate-200 rounded p-2 text-sm bg-slate-50 font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                                >
                                    {[0, 1, 2, 3, 4, 5, 6, 7].map(p => (
                                        <option key={p} value={p}>Pattern {String.fromCharCode(65 + p)}</option>
                                    ))}
                                </select>
                            </div>
                        </section>

                        <div className="border-t border-slate-200"></div>

                        {/* 3. Quick Jump Navigation */}
                        <section>
                            <h2 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-3">Jump To Guild</h2>
                            <nav className="space-y-1">
                                {targetGuilds.map(guildId => (
                                    <button
                                        key={guildId}
                                        onClick={() => onGuildClick(guildId)}
                                        className={`w-full text-left px-4 py-3 lg:px-3 lg:py-2 text-base lg:text-sm rounded-lg transition-all duration-200 flex items-center group ${selectedGuild === guildId
                                            ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm hover:text-blue-600 dark:hover:text-blue-300'
                                            }`}
                                    >
                                        <span className={`w-2 h-2 rounded-full mr-3 transition-colors ${selectedGuild === guildId ? 'bg-blue-500 dark:bg-blue-400' : 'bg-slate-300 dark:bg-slate-600 group-hover:bg-blue-500 dark:group-hover:bg-blue-400'
                                            }`}></span>
                                        {GUILDS[guildId as keyof typeof GUILDS]}
                                    </button>
                                ))}
                            </nav>
                        </section>

                    </div>

                    <div className="p-4 border-t border-slate-200 text-xs text-center text-slate-400 bg-white">
                        {earthDays.toLocaleString()} Earth Days Elapsed
                    </div>
                </div>
            </aside>
        </>
    );
}
