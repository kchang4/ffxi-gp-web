'use client';

import dynamic from 'next/dynamic';
import { useEffect, useCallback, useRef } from 'react';
import {
    useVanaTime,
    calculateEarthDays,
    getVanaTime,
} from '../hooks/useVanaTime';
import { useStore } from '../store/useStore';
import { useGuildScroll } from '../hooks/useGuildScroll';
import GuildList from './GuildList';

const Sidebar = dynamic(() => import('./Sidebar'), {
    loading: () => <div className="w-72 bg-white dark:bg-slate-800 animate-pulse" />,
    ssr: false,
});
import { GuildData } from '../types/guild';
import { TARGET_GUILD_IDS } from '../constants';

interface GP_CalculatorProps {
    initialGuildData: GuildData | null;
    initialTheme: 'light' | 'dark';
}

export default function GP_Calculator({
    initialGuildData,
    initialTheme,
}: GP_CalculatorProps) {
    const {
        vYear, vMonth, vDay, setVanaDate,
        pattern, setPattern,
        guildData, setGuildData,
        isSidebarOpen, setIsSidebarOpen,
        theme, setTheme, toggleTheme,
        mounted, setMounted,
        selectedGuild, setSelectedGuild
    } = useStore();

    const currentVana = useVanaTime();
    const isFirstMount = useRef(true);

    const {
        pendingScrollGuild,
        setPendingScrollGuild,
        isProgrammaticScroll,
        scrollToGuild,
    } = useGuildScroll();

    // Initialization
    useEffect(() => {
        if (isFirstMount.current) {
            setGuildData(initialGuildData);
            setTheme(initialTheme);
            setMounted(true);
            isFirstMount.current = false;
        }

        // Fallback if data wasn't passed from server
        if (!initialGuildData && !guildData) {
            fetch('/guild_data.json')
                .then((res) => res.json())
                .then((data) => setGuildData(data));
        }

        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const p = params.get('pattern');
            if (p) setPattern(Number(p));
            const g = params.get('guild');
            if (g) {
                setPendingScrollGuild(Number(g));
                setSelectedGuild(Number(g));
            }
            const t = params.get('timestamp');
            if (t) {
                const targetDate = new Date(Number(t));
                if (!isNaN(targetDate.getTime())) {
                    const vDate = getVanaTime(targetDate);
                    setVanaDate(vDate.vYear, vDate.vMonth, vDate.vDay);
                }
            }
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const { earthDays } = calculateEarthDays(vYear, vMonth, vDay);

    const updateUrl = useCallback(
        (newParams: Record<string, string>, replace = false) => {
            if (typeof window === 'undefined') return;
            const url = new URL(window.location.href);
            let hasChanges = false;
            Object.keys(newParams).forEach((key) => {
                const current = url.searchParams.get(key);
                const next = newParams[key];
                if (key === 'guild') {
                    setSelectedGuild(next ? Number(next) : null);
                }
                if (next) {
                    if (current !== next) {
                        url.searchParams.set(key, next);
                        hasChanges = true;
                    }
                } else {
                    if (url.searchParams.has(key)) {
                        url.searchParams.delete(key);
                        hasChanges = true;
                    }
                }
            });
            if (hasChanges) {
                if (replace) {
                    window.history.replaceState({}, '', url.toString());
                } else {
                    window.history.pushState({}, '', url.toString());
                }
            }
        },
        [setSelectedGuild],
    );

    // Handle Auto-Scroll
    useEffect(() => {
        if (guildData && pendingScrollGuild !== null) {
            setTimeout(() => {
                scrollToGuild(pendingScrollGuild, updateUrl, () =>
                    setIsSidebarOpen(false),
                );
                setPendingScrollGuild(null);
            }, 100);
        }
    }, [guildData, pendingScrollGuild, scrollToGuild, setIsSidebarOpen, setPendingScrollGuild, updateUrl]);

    // Sync state to URL
    useEffect(() => {
        if (!mounted) return;
        const daysSinceEpochVana =
            (vYear - 886) * 360 + (vMonth - 1) * 30 + (vDay - 1);
        const earthMilliseconds = (daysSinceEpochVana / 25) * 86400000;
        const epochBase = Date.UTC(2002, 0, 1) - 9 * 3600000;
        const finalTimestamp = epochBase + earthMilliseconds;
        updateUrl(
            {
                pattern: String(pattern),
                timestamp: String(Math.floor(finalTimestamp)),
            },
            true,
        );
    }, [vYear, vMonth, vDay, pattern, mounted, updateUrl]);

    const setDateToNow = () => {
        setVanaDate(currentVana.vYear, currentVana.vMonth, currentVana.vDay);
    };

    const handleGuildClick = (guildId: number) => {
        scrollToGuild(guildId, updateUrl, () => setIsSidebarOpen(false));
    };

    return (
        <div
            className={`flex h-screen font-sans transition-colors duration-300 ${mounted ? (theme === 'dark' ? 'dark bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900') : 'bg-gray-50 text-gray-900'}`}
        >
            <Sidebar
                currentVana={currentVana}
                setDateToNow={setDateToNow}
                onGuildClick={handleGuildClick}
                earthDays={earthDays}
            />

            <GuildList
                guildData={guildData}
                targetGuilds={TARGET_GUILD_IDS}
                pattern={pattern}
                earthDays={earthDays}
                onGuildHeaderClick={handleGuildClick}
                isProgrammaticScroll={isProgrammaticScroll}
                updateUrl={updateUrl}
            />
        </div>
    );
}
