import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { DailyAverageRecord } from '../../interfaces/dailyAverage';
import Overview from '../overview';

vi.mock('@formkit/auto-animate/react', () => ({
    useAutoAnimate: () => [null],
}));

vi.mock('../../services/firebase', () => ({
    loadCurrentFuelPrices: vi.fn(),
    loadDailyAverages: vi.fn(),
}));

const { loadCurrentFuelPrices, loadDailyAverages } = await import('../../services/firebase');

const stationData = {
    updated: '10:30',
    data: [
        {
            id: 'station-shell',
            brand: 'Shell',
            name: 'Shell Goslar',
            diesel: 1.799,
            e5: 1.949,
            e10: 1.889,
            dist: 1,
            houseNumber: '1',
            isOpen: true,
            lat: 0,
            lng: 0,
            place: 'Goslar',
            postCode: 38640,
            street: 'Markt',
        },
        {
            id: 'station-aral',
            brand: 'Aral',
            name: 'Aral Braunlage',
            diesel: 1.759,
            e5: 1.909,
            e10: 1.849,
            dist: 2,
            houseNumber: '2',
            isOpen: false,
            lat: 0,
            lng: 0,
            place: 'Braunlage',
            postCode: 38700,
            street: 'Bergstrasse',
        },
    ],
};

const dailyAverages: DailyAverageRecord[] = [
    {
        day: '2026-03-27',
        source: {
            input_collection: 'input',
            output_collection: 'output',
            snapshots_used: 1,
            open_only: true,
            day_key_timezone: 'UTC',
        },
        stations: {
            'station-shell': {
                station_id: 'station-shell',
                average: { diesel: 1.8, e5: 1.95, e10: 1.89 },
                counts: { diesel: 1, e5: 1, e10: 1 },
            },
            'station-aral': {
                station_id: 'station-aral',
                average: { diesel: 1.76, e5: 1.91, e10: 1.85 },
                counts: { diesel: 1, e5: 1, e10: 1 },
            },
        },
    },
];

describe('Overview', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.mocked(loadCurrentFuelPrices).mockResolvedValue(stationData);
        vi.mocked(loadDailyAverages).mockResolvedValue(dailyAverages);
        vi.mocked(UC_UI.areAllConsentsAccepted).mockReturnValue(true);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('loads stations after consent, filters by open status, and can open the disclaimer modal', async () => {
        const { container } = render(
            <MemoryRouter>
                <Overview />
            </MemoryRouter>,
        );

        expect(screen.getByText(/funktionellen Cookies akzeptieren/i)).toBeInTheDocument();

        await act(async () => {
            await Promise.resolve();
        });

        await act(async () => {
            window.dispatchEvent(new Event('UC_UI_INITIALIZED'));
            await Promise.resolve();
            await Promise.resolve();
            vi.advanceTimersByTime(1500);
        });

        expect(loadCurrentFuelPrices).toHaveBeenCalledTimes(1);

        vi.useRealTimers();
        const user = userEvent.setup();
        expect(screen.getByText('Shell')).toBeInTheDocument();
        expect(screen.queryByText('Aral')).not.toBeInTheDocument();

        await user.click(container.querySelector('.toolbar-slider-toggle') as HTMLElement);

        expect(screen.getByText('Aral')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'E5' }));

        const brands = Array.from(container.querySelectorAll('.station-brand')).map((element) => element.textContent);
        expect(brands).toEqual(['Aral', 'Shell']);

        await user.click(container.querySelector('.btn-filter') as HTMLElement);
        await user.click(screen.getByLabelText('goslar'));

        expect(screen.getByText('Shell')).toBeInTheDocument();
        expect(screen.queryByText('Aral')).not.toBeInTheDocument();

        await user.click(screen.getByText('Disclaimer'));

        expect(screen.getByText('Haftungsausschluss')).toBeInTheDocument();
        expect(document.body).toHaveClass('overflow-hidden');
    });
});
