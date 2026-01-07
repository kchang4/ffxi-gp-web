import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GUILDS } from '../constants';
import { VanaTime } from '../hooks/useVanaTime';
import NumberInput from './ui/NumberInput';
import { Icons } from './ui/Icons';
import { useStore } from '../store/useStore';

interface SidebarProps {
  currentVana: VanaTime;
  setDateToNow: () => void;
  onGuildClick: (id: number) => void;
  earthDays: number;
}

export default function Sidebar({
  currentVana,
  setDateToNow,
  onGuildClick,
  earthDays,
}: SidebarProps) {
  const {
    isSidebarOpen, setIsSidebarOpen,
    theme, toggleTheme,
    vYear, setVanaDate, vMonth, vDay,
    pattern, setPattern,
    selectedGuild,
    mounted
  } = useStore();

  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  const handleCopyLink = () => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    });
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-[55] lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-[60] w-72 lg:static lg:translate-x-0 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <AnimatePresence mode="wait">
          {(isSidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
            <motion.div
              initial={typeof window !== 'undefined' && window.innerWidth < 1024 ? { x: '-100%' } : {}}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="flex flex-col h-full w-72 bg-slate-50 dark:bg-slate-900 shadow-2xl lg:shadow-none border-r border-slate-200 dark:border-white/5"
            >
              <div className="p-6 flex justify-between items-center bg-white dark:bg-slate-800 shadow-sm z-10">
                <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  FFXI GP Calculator
                </h1>

                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ rotate: 45, scale: 1.1 }}
                    whileTap={{ scale: 0.9, rotate: -45 }}
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 transition"
                    title="Toggle Theme"
                    aria-label={
                      theme === 'dark'
                        ? 'Switch to light mode'
                        : 'Switch to dark mode'
                    }
                  >
                    {theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}
                  </motion.button>

                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden text-slate-500 hover:text-slate-700 font-bold text-xl dark:text-slate-400 dark:hover:text-slate-200"
                    aria-label="Close sidebar"
                  >
                    <Icons.Close />
                  </button>
                </div>
              </div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.05 } },
                  hidden: {}
                }}
                className="flex-1 overflow-y-auto p-6 space-y-8"
              >
                <motion.section
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  tabIndex={0}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                      Vana'diel Date
                    </h2>
                    {currentVana.vYear > 0 && (
                      <motion.button
                        whileHover={{ rotate: 180 }}
                        whileTap={{ scale: 0.9, rotate: 360 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                        onClick={setDateToNow}
                        className="text-white bg-slate-700 hover:bg-slate-600 transition p-1.5 rounded-full shadow-sm"
                        title="Sync to Current Vana'diel Time"
                      >
                        <Icons.Sync />
                      </motion.button>
                    )}
                  </div>

                  {/* Live Clock Widget */}
                  {currentVana.vYear > 0 && (
                    <div className="mb-5 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden relative">
                      <div className="bg-slate-800 text-white p-3 text-center relative overflow-hidden">
                        <div className="relative z-10 flex flex-col justify-center items-center">
                          <span className="text-2xl font-mono font-bold tracking-widest leading-none">
                            {String(currentVana.vHour).padStart(2, '0')}:
                            {String(currentVana.vMinute).padStart(2, '0')}
                            <span className="text-slate-400 text-base">
                              :{String(currentVana.vSecond).padStart(2, '0')}
                            </span>
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
                            {currentVana.vDayOfWeek}
                          </span>
                        </div>
                      </div>
                      <div className="p-3 text-center bg-white dark:bg-slate-800">
                        <div className="flex justify-center items-baseline space-x-1">
                          <span className="text-xl font-bold text-slate-700 dark:text-slate-200">
                            {currentVana.vYear}
                          </span>
                          <span className="text-slate-400">/</span>
                          <span className="text-xl font-bold text-slate-700 dark:text-slate-200">
                            {String(currentVana.vMonth).padStart(2, '0')}
                          </span>
                          <span className="text-slate-400">/</span>
                          <span className="text-xl font-bold text-slate-700 dark:text-slate-200">
                            {String(currentVana.vDay).padStart(2, '0')}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Calculator Inputs */}
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                    <p className="text-xs font-semibold text-slate-400 uppercase mb-2">
                      Target Date
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1">
                        <NumberInput
                          label="Year"
                          value={vYear}
                          onChange={(e) =>
                            setVanaDate(Math.max(1, Number(e.target.value)), vMonth, vDay)
                          }
                          min={1}
                        />
                      </div>
                      <div>
                        <NumberInput
                          label="Month"
                          value={vMonth}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            let next = val;
                            if (val > 12) next = 12;
                            else if (val < 1 && e.target.value !== '') next = 1;
                            setVanaDate(vYear, next, vDay);
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
                            let next = val;
                            if (val > 30) next = 30;
                            else if (val < 1 && e.target.value !== '') next = 1;
                            setVanaDate(vYear, vMonth, next);
                          }}
                          min={1}
                          max={30}
                        />
                      </div>
                    </div>
                  </div>
                </motion.section>

                <div className="border-t border-slate-200"></div>

                {/* 2. Pattern Selection */}
                <motion.section
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  tabIndex={0}
                >
                  <h2 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-3">
                    Pattern
                  </h2>
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <select
                      aria-label="Selection Rotation Pattern"
                      value={pattern}
                      onChange={(e) => setPattern(Number(e.target.value))}
                      className="w-full border-slate-200 dark:border-slate-600 rounded p-2 text-sm bg-slate-50 dark:bg-slate-700 font-medium text-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                    >
                      {[0, 1, 2, 3, 4, 5, 6, 7].map((p) => (
                        <option key={p} value={p}>
                          Pattern {String.fromCharCode(65 + p)}
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.section>

                <div className="border-t border-slate-200"></div>

                {/* 3. Quick Jump Navigation */}
                <motion.section
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  tabIndex={0}
                >
                  <h2 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-3">
                    Jump To Guild
                  </h2>
                  <nav className="space-y-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((guildId) => (
                      <button
                        key={guildId}
                        onClick={() => onGuildClick(guildId)}
                        className={`w-full text-left px-4 py-3 lg:px-3 lg:py-2 text-base lg:text-sm rounded-lg transition-all duration-200 flex items-center group ${selectedGuild === guildId
                          ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm hover:text-blue-600 dark:hover:text-blue-300'
                          }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full mr-3 transition-colors ${selectedGuild === guildId
                            ? 'bg-blue-500 dark:bg-blue-400'
                            : 'bg-slate-300 dark:bg-slate-600 group-hover:bg-blue-500 dark:group-hover:bg-blue-400'
                            }`}
                        ></span>
                        {GUILDS[guildId as keyof typeof GUILDS]}
                      </button>
                    ))}
                  </nav>
                </motion.section>

                {/* Smart Sharing */}
                <motion.section
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="pt-2"
                >
                  <button
                    onClick={handleCopyLink}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition flex items-center justify-center space-x-2 shadow-sm active:scale-95"
                  >
                    <Icons.Sync />
                    <span>{copyStatus === 'copied' ? 'Link Copied!' : 'Copy Shareable Link'}</span>
                  </button>
                </motion.section>
              </motion.div>

              <div className="p-4 border-t border-slate-200 dark:border-slate-700 text-xs text-center text-slate-400 bg-white dark:bg-slate-800">
                {earthDays.toLocaleString()} Earth Days Elapsed
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>
    </>
  );
}
