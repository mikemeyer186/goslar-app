import { DailyAverageRecord, FuelSelection, LastPriceRecord, StationLatestPricePoint, StationPriceHistoryPoint } from '../interfaces/dailyAverage';
import Station from '../interfaces/station';

interface VisibleStationsParams {
    fuelStations: Station[];
    activeSelection: FuelSelection;
    showOnlyOpenStations: boolean;
    selectedCities: string[];
}

/**
 * Formats a date string in the format "YYYY-MM-DD" to a more user-friendly format "DD.MM." for display purposes.
 * @param day - The date string to format
 * @returns - The formatted date string in the format "DD.MM."
 */
export function formatHistoryLabel(day: string) {
    const [, month, dayOfMonth] = day.split('-');
    return `${dayOfMonth}.${month}.`;
}

/**
 * Builds a price history for each station based on the provided daily average records.
 * @param records - The daily average records
 * @returns - A record mapping station IDs to their price history
 */
export function buildStationPriceHistory(records: DailyAverageRecord[]) {
    const latestRecords = records
        .slice()
        .sort((a, b) => a.day.localeCompare(b.day))
        .slice(-30);
    const stationIds = Array.from(new Set(latestRecords.flatMap((record) => Object.keys(record.stations ?? {}))));

    return stationIds.reduce<Record<string, StationPriceHistoryPoint[]>>((historyByStation, stationId) => {
        historyByStation[stationId] = latestRecords.map((record) => {
            const stationEntry = record.stations?.[stationId];

            return {
                day: record.day,
                label: formatHistoryLabel(record.day),
                diesel: stationEntry?.average.diesel ?? null,
                e5: stationEntry?.average.e5 ?? null,
                e10: stationEntry?.average.e10 ?? null,
            };
        });

        return historyByStation;
    }, {});
}

const berlinHourFormatter = new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Berlin',
});

const berlinWeekdayFormatter = new Intl.DateTimeFormat('de-DE', {
    weekday: 'short',
    timeZone: 'Europe/Berlin',
});

const berlinTooltipFormatter = new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Berlin',
});

function normalizePrice(value: number | null | undefined) {
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function formatLatestWeekday(date: Date) {
    return berlinWeekdayFormatter.format(date).replace('.', '');
}

/**
 * Builds real-price histories for each station based on the latest timestamp records.
 * @param records - The latest timestamp records
 * @returns - A record mapping station IDs to their latest real-price history
 */
export function buildStationLatestPriceHistory(records: LastPriceRecord[]) {
    const latestRecords = records
        .slice()
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-336);
    const stationIds = Array.from(new Set(latestRecords.flatMap((record) => record.data.map((station) => station.id).filter(Boolean))));

    return stationIds.reduce<Record<string, StationLatestPricePoint[]>>((historyByStation, stationId) => {
        historyByStation[stationId] = latestRecords.map((record) => {
            const stationEntry = record.data.find((station) => station.id === stationId);
            const date = new Date(record.date);
            const isClosed = stationEntry?.isOpen !== true;

            return {
                date: record.date,
                label: Number.isNaN(date.getTime()) ? '' : berlinHourFormatter.format(date),
                tooltipLabel: Number.isNaN(date.getTime()) ? record.date : berlinTooltipFormatter.format(date),
                weekdayLabel: Number.isNaN(date.getTime()) ? '' : formatLatestWeekday(date),
                diesel: isClosed ? null : normalizePrice(stationEntry?.diesel),
                e5: isClosed ? null : normalizePrice(stationEntry?.e5),
                e10: isClosed ? null : normalizePrice(stationEntry?.e10),
                isClosed,
            };
        });

        return historyByStation;
    }, {});
}

/**
 * Returns the visible fuel stations based on the provided filter parameters.
 * @param params - The parameters for filtering the fuel stations
 * @returns - An object containing the open stations and the filtered stations
 */
export function getVisibleStations({ fuelStations, activeSelection, showOnlyOpenStations, selectedCities }: VisibleStationsParams) {
    const sortedFuelStations = fuelStations
        .slice()
        .sort((a, b) => a[activeSelection] - b[activeSelection])
        .filter((station) => station[activeSelection] > 0);

    const openStations = showOnlyOpenStations ? sortedFuelStations.filter((station) => station.isOpen) : sortedFuelStations;
    const isFiltered = selectedCities.length > 0;
    const filteredFuelStations = isFiltered
        ? openStations.filter((station) => selectedCities.some((city) => station.place.toLowerCase().includes(city.toLowerCase())))
        : openStations;

    return { openStations, filteredFuelStations };
}
