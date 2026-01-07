import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import GuildList from '../app/components/GuildList';
import { GuildData } from '../app/types/guild';

// Mock Props
const mockGuildData: GuildData = {
    '0': {
        // Fishing
        '1': {
            // Pattern 1
            '0': [
                // Day 0
                { id: 101, name: 'Carp', points: 100, max: 1000 },
            ],
        },
    },
};

const defaultProps = {
    guildData: mockGuildData,
    targetGuilds: [0],
    pattern: 1,
    earthDays: 0,
    setIsSidebarOpen: () => { },
    onGuildHeaderClick: () => { },
    isProgrammaticScroll: { current: false },
    updateUrl: () => { },
};

describe('GuildList', () => {
    it('renders the guild name', () => {
        render(<GuildList {...defaultProps} />);
        expect(screen.getByText('Fishing')).toBeTruthy();
    });

    it('renders the item when data exists', () => {
        render(<GuildList {...defaultProps} />);
        expect(screen.getAllByText('Carp').length).toBeGreaterThan(0);
    });

    it('renders skeleton rows when data is null', () => {
        const { container } = render(<GuildList {...defaultProps} guildData={null} />);
        // Look for the pulse animation class
        const skeletons = container.querySelectorAll('.animate-pulse');
        expect(skeletons.length).toBeGreaterThan(0);
    });
});
