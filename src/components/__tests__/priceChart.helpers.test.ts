import { describe, expect, it } from 'vitest';
import { clamp, createLinearTicks, formatPrice, formatTooltipDay } from '../../utils/priceChart.helpers';

describe('priceChart helpers', () => {
    it('clamps values to the provided range', () => {
        expect(clamp(-1, 0, 10)).toBe(0);
        expect(clamp(12, 0, 10)).toBe(10);
        expect(clamp(5, 0, 10)).toBe(5);
    });

    it('creates evenly spaced linear ticks', () => {
        expect(createLinearTicks(0, 1, 5, 2)).toEqual([0, 0.25, 0.5, 0.75, 1]);
        expect(createLinearTicks(1.234, 1.234, 5, 3)).toEqual([1.234]);
    });

    it('formats tooltip days and prices for display', () => {
        expect(formatTooltipDay('2026-03-28')).toBe('28.03.2026');
        expect(formatTooltipDay('')).toBe('');
        expect(formatPrice(1.859)).toBe('1,86 €');
        expect(formatPrice(null)).toBe('-');
    });
});
