import { create } from 'zustand';
import { GuildData } from '../types/guild';
import { VanaTime } from '../hooks/useVanaTime';

interface AppState {
    // Date & Pattern
    vYear: number;
    vMonth: number;
    vDay: number;
    pattern: number;

    // Data
    guildData: GuildData | null;

    // UI State
    isSidebarOpen: boolean;
    selectedGuild: number | null;
    mounted: boolean;
    theme: 'light' | 'dark';

    // Actions
    setVanaDate: (year: number, month: number, day: number) => void;
    setPattern: (pattern: number) => void;
    setGuildData: (data: GuildData | null) => void;
    setIsSidebarOpen: (isOpen: boolean) => void;
    setSelectedGuild: (id: number | null) => void;
    setMounted: (mounted: boolean) => void;
    setTheme: (theme: 'light' | 'dark') => void;
    toggleTheme: () => void;
}

export const useStore = create<AppState>((set) => ({
    vYear: 1495,
    vMonth: 3,
    vDay: 13,
    pattern: 1,
    guildData: null,
    isSidebarOpen: false,
    selectedGuild: null,
    mounted: false,
    theme: 'light',

    setVanaDate: (vYear, vMonth, vDay) => set({ vYear, vMonth, vDay }),
    setPattern: (pattern) => set({ pattern }),
    setGuildData: (guildData) => set({ guildData }),
    setIsSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
    setSelectedGuild: (selectedGuild) => set({ selectedGuild }),
    setMounted: (mounted) => set({ mounted }),
    setTheme: (theme) => set({ theme }),
    toggleTheme: () => set((state) => {
        const next = state.theme === 'dark' ? 'light' : 'dark';
        document.cookie = `theme=${next}; path=/; max-age=31536000`;
        document.documentElement.classList.toggle('dark', next === 'dark');
        return { theme: next };
    }),
}));
