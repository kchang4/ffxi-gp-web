export interface GuildItem {
    id: number;
    name: string;
    points: number;
    max: number;
}

// Keyed by Rotation Day (number) -> Array of Items
export interface RotationData {
    [day: string]: GuildItem[];
}

// Keyed by Pattern ID (number 0-7) -> Rotation Data
export interface PatternData {
    [patternId: string]: RotationData;
}

// Keyed by Guild ID (number 0-8) -> Pattern Data
export interface GuildData {
    [guildId: string]: PatternData;
}
