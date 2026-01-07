import { useState, useEffect } from 'react';

const WEEK_DAYS = ['Firesday', 'Earthsday', 'Watersday', 'Windsday', 'Iceday', 'Lightningday', 'Lightsday', 'Darksday'];

export interface VanaTime {
    vYear: number;
    vMonth: number;
    vDay: number;
    vHour: number;
    vMinute: number;
    vSecond: number;
    vDayOfWeek: string;
}

// 1 Earth Second = 25 Vana Seconds
// Epoch: Midnight Jan 1, 2002 (JST) = 1st of Fire, 0886
// JST is UTC+9. So Epoch in UTC is 2001-12-31 15:00:00
export function getVanaTime(earthDate: Date): VanaTime {
    const earthMs = earthDate.getTime();
    const earthBase = Date.UTC(2002, 0, 1) - (9 * 60 * 60 * 1000);
    const msElapsed = earthMs - earthBase;
    const vanaMsElapsed = msElapsed * 25;

    const vanaYearLength = 360 * 24 * 60 * 60 * 1000;
    const vanaMonthLength = 30 * 24 * 60 * 60 * 1000;
    const vanaDayLength = 24 * 60 * 60 * 1000;
    const vanaHourLength = 60 * 60 * 1000;
    const vanaMinLength = 60 * 1000;
    const vanaSecLength = 1000;

    let remaining = vanaMsElapsed;

    const vYear = 886 + Math.floor(remaining / vanaYearLength);
    remaining %= vanaYearLength;

    const vMonth = 1 + Math.floor(remaining / vanaMonthLength);
    remaining %= vanaMonthLength;

    const vDay = 1 + Math.floor(remaining / vanaDayLength);
    const totalDays = Math.floor(vanaMsElapsed / vanaDayLength);
    const vDayOfWeek = WEEK_DAYS[totalDays % 8];

    remaining %= vanaDayLength;

    const vHour = Math.floor(remaining / vanaHourLength);
    remaining %= vanaHourLength;

    const vMinute = Math.floor(remaining / vanaMinLength);
    remaining %= vanaMinLength;
    const vSecond = Math.floor(remaining / vanaSecLength);

    return { vYear, vMonth, vDay, vHour, vMinute, vSecond, vDayOfWeek };
}

export function useVanaTime() {
    const [currentVana, setCurrentVana] = useState<VanaTime>({ vYear: 0, vMonth: 0, vDay: 0, vHour: 0, vMinute: 0, vSecond: 0, vDayOfWeek: '' });

    useEffect(() => {
        const tick = () => {
            setCurrentVana(getVanaTime(new Date()));
        };
        tick(); // Initial call

        // Update every 40ms (1 Vana second)
        const interval = setInterval(tick, 40);
        return () => clearInterval(interval);
    }, []);

    return currentVana;
}

export function calculateEarthDays(vYear: number, vMonth: number, vDay: number) {
    const daysSinceEpochVana = (vYear - 886) * 360 + (vMonth - 1) * 30 + (vDay - 1);
    const earthDays = Math.floor(daysSinceEpochVana / 25);
    return { earthDays, daysSinceEpochVana };
}
