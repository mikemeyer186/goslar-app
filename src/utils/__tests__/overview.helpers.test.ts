import { describe, expect, it } from 'vitest';
import type { DailyAverageRecord, LastPriceRecord } from '../../interfaces/dailyAverage';
import type Station from '../../interfaces/station';
import { buildStationLatestPriceHistory, buildStationPriceHistory, formatHistoryLabel, getVisibleStations } from '../overview.helpers';

const stations: Station[] = [
    {
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
    {
        id: 'station-jet',
        brand: 'JET',
        name: 'Jet Goslar',
        diesel: 0,
        e5: 1.889,
        e10: 1.829,
        dist: 3,
        houseNumber: '3',
        isOpen: true,
        lat: 0,
        lng: 0,
        place: 'Goslar',
        postCode: 38644,
        street: 'Bahnhofstrasse',
    },
];


function createLastPriceRecord(date: string, isShellOpen: boolean, includeAral = true): LastPriceRecord {
    return {
        date,
        data: [
            {
                id: 'station-shell',
                diesel: 1.7,
                e5: 1.8,
                e10: 1.75,
                isOpen: isShellOpen,
            },
            ...(includeAral
                ? [
                      {
                          id: 'station-aral',
                          diesel: 1.68,
                          e5: 1.78,
                          e10: 1.72,
                          isOpen: true,
                      },
                  ]
                : []),
        ],
    };
}

function createRecord(day: string, stationIds: string[]): DailyAverageRecord {
    return {
        day,
        source: {
            input_collection: 'input',
            output_collection: 'output',
            snapshots_used: 1,
            open_only: true,
            day_key_timezone: 'UTC',
        },
        stations: Object.fromEntries(
            stationIds.map((stationId) => [
                stationId,
                {
                    station_id: stationId,
                    average: {
                        diesel: stationId === 'station-shell' ? 1.7 : null,
                        e5: 1.8,
                        e10: 1.75,
                    },
                    counts: { diesel: 1, e5: 1, e10: 1 },
                },
            ]),
        ),
    };
}

describe('overview helpers', () => {
    it('formats history labels as day and month', () => {
        expect(formatHistoryLabel('2026-03-28')).toBe('28.03.');
    });

    it('builds station history sorted by day and limited to the last 30 records', () => {
        const records = Array.from({ length: 31 }, (_, index) => {
            const day = String(index + 1).padStart(2, '0');
            return createRecord(`2026-03-${day}`, index % 2 === 0 ? ['station-shell'] : ['station-shell', 'station-aral']);
        });

        const history = buildStationPriceHistory(records);

        expect(history['station-shell']).toHaveLength(30);
        expect(history['station-shell'][0]).toMatchObject({
            day: '2026-03-02',
            label: '02.03.',
            diesel: 1.7,
        });
        expect(history['station-aral'][0]).toMatchObject({
            day: '2026-03-02',
            diesel: null,
        });
        expect(history['station-shell'][29].day).toBe('2026-03-31');
    });



    it('builds latest real-price history sorted by timestamp and marks closed periods', () => {
        const records: LastPriceRecord[] = [
            createLastPriceRecord('2026-03-30T10:30:00.000Z', false, false),
            createLastPriceRecord('2026-03-30T10:00:00.000Z', true),
        ];

        const history = buildStationLatestPriceHistory(records);

        expect(history['station-shell']).toHaveLength(2);
        expect(history['station-shell'][0]).toMatchObject({
            date: '2026-03-30T10:00:00.000Z',
            label: '12:00',
            weekdayLabel: 'Mo',
            diesel: 1.7,
            isClosed: false,
        });
        expect(history['station-shell'][1]).toMatchObject({
            date: '2026-03-30T10:30:00.000Z',
            diesel: null,
            e5: null,
            e10: null,
            isClosed: true,
        });
        expect(history['station-aral'][1]).toMatchObject({
            diesel: null,
            isClosed: true,
        });
    });

    it('limits latest real-price history to 336 entries', () => {
        const records = Array.from({ length: 337 }, (_, index) => createLastPriceRecord(`2026-03-30T${String(index % 24).padStart(2, '0')}:00:00.000Z`, true));

        const history = buildStationLatestPriceHistory(records);

        expect(history['station-shell']).toHaveLength(336);
    });

    it('sorts, removes zero prices, and applies open and city filters', () => {
        const visibleStations = getVisibleStations({
            fuelStations: stations,
            activeSelection: 'diesel',
            showOnlyOpenStations: true,
            selectedCities: ['goslar'],
        });

        expect(visibleStations.openStations.map((station) => station.id)).toEqual(['station-shell']);
        expect(visibleStations.filteredFuelStations.map((station) => station.id)).toEqual(['station-shell']);
    });

    it('keeps closed stations when the open-only filter is disabled and sorts by selected fuel', () => {
        const visibleStations = getVisibleStations({
            fuelStations: stations,
            activeSelection: 'e10',
            showOnlyOpenStations: false,
            selectedCities: [],
        });

        expect(visibleStations.filteredFuelStations.map((station) => station.id)).toEqual(['station-jet', 'station-aral', 'station-shell']);
    });
});
