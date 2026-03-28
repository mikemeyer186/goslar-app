import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type Station from '../../interfaces/station';
import type { StationPriceHistoryPoint } from '../../interfaces/dailyAverage';
import StationTile from '../stationTile';

vi.mock('../priceChart', () => ({
    default: ({ data }: { data: StationPriceHistoryPoint[] }) => <div data-testid="price-chart">chart:{data.length}</div>,
}));

const station: Station = {
    id: 'station-shell',
    brand: 'Shell',
    name: 'Shell Goslar',
    diesel: 1.799,
    e5: 1.939,
    e10: 1.879,
    dist: 1,
    houseNumber: '1',
    isOpen: true,
    lat: 0,
    lng: 0,
    place: 'Goslar',
    postCode: 38640,
    street: 'Markt',
};

const history: StationPriceHistoryPoint[] = [
    {
        day: '2026-03-28',
        label: '28.03.',
        diesel: 1.799,
        e5: 1.939,
        e10: 1.879,
    },
];

describe('StationTile', () => {
    it('shows the selected price collapsed and expands on click', async () => {
        const user = userEvent.setup();
        const { container } = render(<StationTile station={station} activeSelection="diesel" priceHistory={history} />);

        expect(container.querySelector('.station-right')).toHaveTextContent('1,79 €');

        await user.click(container.querySelector('.station-tile') as HTMLElement);

        expect(screen.getByText('Die Tankstelle hat geöffnet')).toBeInTheDocument();
        expect(screen.getByTestId('price-chart')).toHaveTextContent('chart:1');
        expect(container.querySelector('.station-price-card-active')).toHaveTextContent('Diesel');
    });

    it('shows fallbacks for unavailable prices', () => {
        const { container } = render(
            <StationTile
                station={{
                    ...station,
                    diesel: 0,
                    e5: 0,
                    e10: 0,
                }}
                activeSelection="diesel"
                priceHistory={[]}
            />,
        );

        expect(container.querySelector('.station-right')).toHaveTextContent('k. A.');
    });
});
