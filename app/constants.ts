export const GUILDS = {
    0: 'Fishing',
    1: 'Woodworking',
    2: 'Smithing',
    3: 'Goldsmithing',
    4: 'Clothcraft',
    5: 'Leathercraft',
    6: 'Bonecraft',
    7: 'Alchemy',
    8: 'Cooking'
} as const;

export const TARGET_GUILD_IDS = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export const SKILL_RANKS = [
    { id: 0, name: 'Amateur' },
    { id: 1, name: 'Recruit' },
    { id: 2, name: 'Initiate' },
    { id: 3, name: 'Novice' },
    { id: 4, name: 'Apprentice' },
    { id: 5, name: 'Journeyman' },
    { id: 6, name: 'Craftsman' },
    { id: 7, name: 'Artisan' },
    { id: 8, name: 'Adept' },
    { id: 9, name: 'Veteran' }
] as const;
