/**
 * Configuration for the price chart, defining the color, labels, axis, ticks and
 * tooltip formatting for each fuel type.
 */

export function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

function roundTick(value: number, precision: number) {
    return Number(value.toFixed(precision));
}

export function createLinearTicks(start: number, end: number, count: number, precision: number) {
    if (count <= 1 || start === end) {
        return [roundTick(start, precision)];
    }

    const step = (end - start) / (count - 1);

    return Array.from({ length: count }, (_, index) => {
        if (index === count - 1) {
            return roundTick(end, precision);
        }

        return roundTick(start + step * index, precision);
    });
}

export function formatTooltipDay(day: string) {
    if (!day) {
        return '';
    }

    const [year, month, dayOfMonth] = day.split('-');
    return `${dayOfMonth}.${month}.${year}`;
}

export function formatPrice(value: number | null) {
    if (value === null || Number.isNaN(value)) {
        return '-';
    }

    return `${value.toFixed(2).replace('.', ',')} €`;
}
