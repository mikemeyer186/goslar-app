import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { PropsWithChildren } from 'react';
import type { StationLatestPricePoint, StationPriceHistoryPoint } from '../../interfaces/dailyAverage';
import PriceChart from '../priceChart';

vi.mock('recharts', () => ({
    ResponsiveContainer: ({ children }: PropsWithChildren) => <div data-testid="responsive-container">{children}</div>,
    LineChart: ({ children }: PropsWithChildren) => <div data-testid="line-chart">{children}</div>,
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    ReferenceArea: ({ label }: { label?: { value?: string } }) => <div data-testid="closed-range">{label?.value}</div>,
    Tooltip: () => <div data-testid="tooltip" />,
    XAxis: ({ ticks = [], tickFormatter }: { ticks?: number[]; tickFormatter?: (value: number) => string }) => (
        <div data-testid="x-axis">{ticks.map((tick) => tickFormatter?.(tick) ?? tick).join('|')}</div>
    ),
    YAxis: () => <div data-testid="y-axis" />,
    Line: ({ connectNulls }: { connectNulls?: boolean }) => <div data-testid="line">{String(connectNulls)}</div>,
}));

const averageData: StationPriceHistoryPoint[] = [
    { day: '2026-03-28', label: '28.03.', diesel: 1.7, e5: 1.8, e10: 1.75 },
];

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
        expect(screen.getByText('Durchschnittspreise der letzten 30 Tage')).toBeInTheDocument();
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
