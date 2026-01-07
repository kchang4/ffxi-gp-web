import { describe, it, expect } from 'vitest';
import { getVanaTime, calculateEarthDays } from '../app/hooks/useVanaTime';

describe('getVanaTime', () => {
    it('calculates the correct Vana year for a known Earth date', () => {
        // Base epoch: Jan 1 2002 00:00:00 JST -> 886/1/1 Vana
        // UTC: Dec 31 2001 15:00:00
        const epoch = new Date(Date.UTC(2001, 11, 31, 15, 0, 0));
        const vana = getVanaTime(epoch);
        expect(vana.vYear).toBe(886);
        expect(vana.vMonth).toBe(1);
        expect(vana.vDay).toBe(1);
    });

    it('advances correctly', () => {
        // 1 Earth Second = 25 Vana Seconds
        const epoch = new Date(Date.UTC(2001, 11, 31, 15, 0, 0));
        const future = new Date(epoch.getTime() + 1000); // +1s Earth
        const vana = getVanaTime(future);
        expect(vana.vSecond).toBe(25);
    });
});

describe('calculateEarthDays', () => {
    it('returns 0 for the base epoch date', () => {
        const { earthDays } = calculateEarthDays(886, 1, 1);
        expect(earthDays).toBe(0);
    });

    it('calculates days correctly for a future date', () => {
        // 886/1/2 = 1 Vana Day later = 25 * 24 * 60 * 60 / 86400 ?? parallel logic
        // Actually Earth Days is based on Vana Days / 25?
        // Let's verify the logic in the hook.
        // (daysSinceEpochVana / 25) * 86400000 = earth ms?
        // No, calculateEarthDays takes Vana Date -> Returns integer Earth Days elapsed since epoch
        // Logic: (vYear - 886)*360 + (vMonth-1)*30 + (vDay-1)

        const { earthDays } = calculateEarthDays(886, 1, 26);
        expect(earthDays).toBe(1);
    });
});
