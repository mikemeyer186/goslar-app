import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { PropsWithChildren } from 'react';
import type { StationLatestPricePoint, StationPriceHistoryPoint } from '../../interfaces/dailyAverage';
import PriceChart from '../priceChart';

const rechartsMockState = vi.hoisted(() => ({
    onResize: undefined as ((width: number, height: number) => void) | undefined,
}));

vi.mock('recharts', () => ({
    ResponsiveContainer: ({ children, onResize }: PropsWithChildren<{ onResize?: (width: number, height: number) => void }>) => {
        rechartsMockState.onResize = onResize;

        return <div data-testid="responsive-container">{children}</div>;
    },
    LineChart: ({ children }: PropsWithChildren) => <div data-testid="line-chart">{children}</div>,
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    ReferenceArea: ({ label }: { label?: { angle?: number; maxLines?: number; value?: string; width?: number } }) => (
        <div data-angle={label?.angle} data-max-lines={label?.maxLines} data-testid="closed-range" data-width={label?.width}>
            {label?.value}
        </div>
    ),
    Tooltip: () => <div data-testid="tooltip" />,
    XAxis: ({
        interval,
        ticks = [],
        tickFormatter,
    }: {
        interval?: number | string;
        ticks?: number[];
        tickFormatter?: (value: number) => string;
    }) => (
        <div data-interval={interval} data-testid="x-axis" data-ticks={ticks.join('|')}>
            {ticks.map((tick) => tickFormatter?.(tick) ?? tick).join('|')}
        </div>
    ),
    YAxis: ({ interval, ticks = [] }: { interval?: number | string; ticks?: number[] }) => (
        <div data-interval={interval} data-testid="y-axis" data-ticks={ticks.join('|')} />
    ),
    Line: ({ connectNulls }: { connectNulls?: boolean }) => <div data-testid="line">{String(connectNulls)}</div>,
}));

const averageData: StationPriceHistoryPoint[] = [
    { day: '2026-03-28', label: '28.03.', diesel: 1.7, e5: 1.8, e10: 1.75 },
];

function createAverageData(count: number): StationPriceHistoryPoint[] {
    return Array.from({ length: count }, (_, index) => {
        const dayOfMonth = index + 1;
        const day = dayOfMonth.toString().padStart(2, '0');

        return {
            day: `2026-03-${day}`,
            label: `${day}.03.`,
            diesel: 1.7 + index * 0.001,
            e5: 1.8 + index * 0.001,
            e10: 1.75 + index * 0.001,
        };
    });
}

function createLatestPriceData(count: number): StationLatestPricePoint[] {
    const startHour = 17;

    return Array.from({ length: count }, (_, index) => {
        const totalMinutes = startHour * 60 + index * 30;
        const hour = Math.floor(totalMinutes / 60) % 24;
        const minute = totalMinutes % 60;
        const label = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

        return {
            date: `2026-03-30T${label}:00.000Z`,
            label,
            tooltipLabel: `30.03.2026, ${label}`,
            weekdayLabel: 'Mo',
            diesel: 1.7 + index * 0.001,
            e5: 1.8 + index * 0.001,
            e10: 1.75 + index * 0.001,
            isClosed: false,
        };
    });
}

function getNumericDataAttribute(element: HTMLElement, attribute: string) {
    return (element.getAttribute(attribute) ?? '').split('|').map(Number);
}

const latestPriceData: StationLatestPricePoint[] = [
    {
        date: '2026-03-30T10:00:00.000Z',
        label: '12:00',
        tooltipLabel: '30.03.2026, 12:00',
        weekdayLabel: 'Mo',
        diesel: 1.71,
        e5: 1.81,
        e10: 1.76,
        isClosed: false,
    },
    {
        date: '2026-03-30T10:30:00.000Z',
        label: '12:30',
        tooltipLabel: '30.03.2026, 12:30',
        weekdayLabel: 'Mo',
        diesel: null,
        e5: null,
        e10: null,
        isClosed: true,
    },
    {
        date: '2026-03-30T11:00:00.000Z',
        label: '13:00',
        tooltipLabel: '30.03.2026, 13:00',
        weekdayLabel: 'Mo',
        diesel: 1.72,
        e5: 1.82,
        e10: 1.77,
        isClosed: false,
    },
];

describe('PriceChart', () => {
    it('shows the 24 hour chart by default and switches tabs', async () => {
        const user = userEvent.setup();
        render(<PriceChart averageData={averageData} latestPriceData={latestPriceData} />);

        expect(screen.getByRole('tab', { name: '24 Stunden' })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByText('Preise der letzten 24 Stunden')).toBeInTheDocument();
        expect(screen.getByTestId('closed-range')).toHaveTextContent('geschlossen');
        expect(screen.getByTestId('x-axis')).toHaveTextContent('12:00');
        expect(screen.getAllByTestId('line')[0]).toHaveTextContent('false');

        await user.click(screen.getByRole('tab', { name: '7 Tage' }));

        expect(screen.getByRole('tab', { name: '7 Tage' })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByText('Preise der letzten 7 Tage')).toBeInTheDocument();
        expect(screen.queryByTestId('closed-range')).not.toBeInTheDocument();
        expect(screen.getAllByTestId('line')[0]).toHaveTextContent('true');

        await user.click(screen.getByRole('tab', { name: '30 Tage' }));

        expect(screen.getByRole('tab', { name: '30 Tage' })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByText('Ø-Preise der letzten 30 Tage')).toBeInTheDocument();
    });

    it('rotates the closed range label at 300px chart width', () => {
        render(<PriceChart averageData={averageData} latestPriceData={latestPriceData} />);

        act(() => {
            rechartsMockState.onResize?.(300, 220);
        });

        expect(screen.getByTestId('closed-range')).toHaveTextContent('geschlossen');
        expect(screen.getByTestId('closed-range')).toHaveAttribute('data-angle', '90');
        expect(screen.getByTestId('closed-range')).not.toHaveAttribute('data-width');
        expect(screen.getByTestId('closed-range')).not.toHaveAttribute('data-max-lines');
    });

    it('renders complete evenly spaced ticks on both axes', () => {
        render(<PriceChart averageData={averageData} latestPriceData={createLatestPriceData(48)} />);

        const xAxis = screen.getByTestId('x-axis');
        const yAxis = screen.getByTestId('y-axis');
        const xTicks = getNumericDataAttribute(xAxis, 'data-ticks');
        const yTicks = getNumericDataAttribute(yAxis, 'data-ticks');
        const xStep = xTicks[1] - xTicks[0];
        const yStep = yTicks[1] - yTicks[0];

        expect(xAxis).toHaveAttribute('data-interval', '0');
        expect(yAxis).toHaveAttribute('data-interval', '0');
        expect(xTicks).toHaveLength(7);
        expect(yTicks).toHaveLength(5);
        expect(xTicks.slice(1).every((tick, index) => Math.abs(tick - xTicks[index] - xStep) < 0.000002)).toBe(true);
        expect(yTicks.slice(1).every((tick, index) => Math.abs(tick - yTicks[index] - yStep) < 0.000002)).toBe(true);
        expect(xAxis).toHaveTextContent('17:00|21:00|01:00|05:00|09:00|13:00|17:00');
    });

    it('uses actual hour labels for partial 24 hour histories', () => {
        render(<PriceChart averageData={averageData} latestPriceData={createLatestPriceData(10)} />);

        expect(screen.getByTestId('x-axis')).toHaveTextContent('17:00|18:00|18:00|19:00|20:00|21:00|21:00');
    });

    it('uses fewer evenly spaced x ticks on narrow 24 hour charts', () => {
        render(<PriceChart averageData={averageData} latestPriceData={createLatestPriceData(48)} />);

        act(() => {
            rechartsMockState.onResize?.(280, 220);
        });

        const xAxis = screen.getByTestId('x-axis');
        const xTicks = getNumericDataAttribute(xAxis, 'data-ticks');
        const xStep = xTicks[1] - xTicks[0];

        expect(xTicks).toHaveLength(4);
        expect(xTicks.slice(1).every((tick, index) => Math.abs(tick - xTicks[index] - xStep) < 0.000002)).toBe(true);
        expect(xAxis).toHaveTextContent('17:00|01:00|09:00|17:00');
    });

    it('uses compact x ticks only for narrow 24 hour and 30 day charts', async () => {
        const user = userEvent.setup();
        render(<PriceChart averageData={createAverageData(30)} latestPriceData={createLatestPriceData(48)} />);

        act(() => {
            rechartsMockState.onResize?.(280, 220);
        });

        await user.click(screen.getByRole('tab', { name: '7 Tage' }));
        expect(getNumericDataAttribute(screen.getByTestId('x-axis'), 'data-ticks')).toHaveLength(1);

        await user.click(screen.getByRole('tab', { name: '30 Tage' }));
        expect(getNumericDataAttribute(screen.getByTestId('x-axis'), 'data-ticks')).toHaveLength(4);
    });

    it('keeps sparse 7 day ticks even when their indexes are adjacent', async () => {
        const user = userEvent.setup();
        const sparseLatestPriceData: StationLatestPricePoint[] = [
            {
                date: '2026-04-01T22:00:00.000Z',
                label: '00:00',
                tooltipLabel: '02.04.2026, 00:00',
                weekdayLabel: 'Do',
                diesel: 1.7,
                e5: 1.8,
                e10: 1.75,
                isClosed: false,
            },
            {
                date: '2026-04-02T22:00:00.000Z',
                label: '00:00',
                tooltipLabel: '03.04.2026, 00:00',
                weekdayLabel: 'Fr',
                diesel: 1.71,
                e5: 1.81,
                e10: 1.76,
                isClosed: false,
            },
        ];

        render(<PriceChart averageData={averageData} latestPriceData={sparseLatestPriceData} />);

        await user.click(screen.getByRole('tab', { name: '7 Tage' }));

        expect(screen.getByTestId('x-axis')).toHaveTextContent('Do|Fr');
        expect(getNumericDataAttribute(screen.getByTestId('x-axis'), 'data-ticks')).toEqual([0, 1]);
    });

    it('keeps dense partial 7 day ticks when they are far apart on the axis', async () => {
        const user = userEvent.setup();
        const partialLatestPriceData: StationLatestPricePoint[] = Array.from({ length: 30 }, (_, index) => {
            const isNextDay = index >= 23;
            const weekdayLabel = isNextDay ? 'Fr' : 'Do';
            const tooltipDate = isNextDay ? '03.04.2026' : '02.04.2026';

            return {
                date: '2026-04-02T00:00:00.000Z',
                label: '00:00',
                tooltipLabel: tooltipDate + ', 00:00',
                weekdayLabel,
                diesel: 1.7 + index * 0.001,
                e5: 1.8 + index * 0.001,
                e10: 1.75 + index * 0.001,
                isClosed: false,
            };
        });

        render(<PriceChart averageData={averageData} latestPriceData={partialLatestPriceData} />);

        await user.click(screen.getByRole('tab', { name: '7 Tage' }));

        expect(screen.getByTestId('x-axis')).toHaveTextContent('Do|Fr');
        expect(getNumericDataAttribute(screen.getByTestId('x-axis'), 'data-ticks')).toEqual([0, 23]);
    });

    it('skips a leading 7 day tick when it would overlap the next day', async () => {
        const user = userEvent.setup();
        const latestPriceDataWithPartialDay: StationLatestPricePoint[] = Array.from({ length: 50 }, (_, index) => {
            const isLeadingPartialDay = index === 0;
            const isNextDay = index === 49;
            const weekdayLabel = isLeadingPartialDay ? 'Mi' : isNextDay ? 'Fr' : 'Do';
            const tooltipDate = isLeadingPartialDay ? '01.04.2026' : isNextDay ? '03.04.2026' : '02.04.2026';

            return {
                date: '2026-04-02T00:00:00.000Z',
                label: '00:00',
                tooltipLabel: tooltipDate + ', 00:00',
                weekdayLabel,
                diesel: 1.7 + index * 0.001,
                e5: 1.8 + index * 0.001,
                e10: 1.75 + index * 0.001,
                isClosed: false,
            };
        });

        render(<PriceChart averageData={averageData} latestPriceData={latestPriceDataWithPartialDay} />);

        await user.click(screen.getByRole('tab', { name: '7 Tage' }));

        expect(screen.getByTestId('x-axis')).toHaveTextContent('Do|Fr');
        expect(getNumericDataAttribute(screen.getByTestId('x-axis'), 'data-ticks')).toEqual([1, 49]);
    });

    it('keeps the tabs visible when the active chart has no data', async () => {
        const user = userEvent.setup();
        render(<PriceChart averageData={[]} latestPriceData={[]} />);

        expect(screen.getByText('Noch keine Preisdaten verfügbar.')).toBeInTheDocument();

        await user.click(screen.getByRole('tab', { name: '24 Stunden' }));

        expect(screen.getByRole('tab', { name: '24 Stunden' })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByText('Noch keine Preisdaten verfügbar.')).toBeInTheDocument();
    });
});
