import { DailyAverageRecord, FuelSelection, StationPriceHistoryPoint } from '../interfaces/dailyAverage';
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
