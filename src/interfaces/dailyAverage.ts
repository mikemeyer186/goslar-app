export type FuelSelection = 'e5' | 'e10' | 'diesel';

export interface DailyAverageStationEntry {
    station_id: string;
    average: Partial<Record<FuelSelection, number | null>>;
    counts: Partial<Record<FuelSelection, number>>;
}

export interface DailyAverageRecord {
    day: string;
    updated_at?: string;
    source: {
        input_collection: string;
        output_collection: string;
        snapshots_used: number;
        open_only: boolean;
        day_key_timezone: string;
    };
    stations: Record<string, DailyAverageStationEntry>;
}

export interface StationPriceHistoryPoint {
    day: string;
    label: string;
    diesel: number | null;
    e5: number | null;
    e10: number | null;
}
