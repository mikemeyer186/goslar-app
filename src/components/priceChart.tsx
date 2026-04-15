import type { DotItemDotProps } from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { useState } from 'react';
import { CartesianGrid, Line, LineChart, ReferenceArea, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { StationLatestPricePoint, StationPriceHistoryPoint } from '../interfaces/dailyAverage';
import { clamp, createLinearTicks, formatPrice, formatTooltipDay } from '../utils/priceChart.helpers';

interface PriceChartProps {
    averageData: StationPriceHistoryPoint[];
    latestPriceData: StationLatestPricePoint[];
}

type ChartTabKey = 'average30' | 'latest24' | 'latest7';

type ChartPoint = {
    index: number;
    label: string;
    diesel: number | null;
    e5: number | null;
    e10: number | null;
    isClosed?: boolean;
    day?: string;
    tooltipLabel?: string;
    weekdayLabel?: string;
};

interface ClosedRange {
    start: number;
    end: number;
}

/**
 * Configuration for the price chart, defining the color, labels, axis, ticks and
 * tooltip formatting for each fuel type.
 */
const lineConfig = {
    diesel: { color: '#457aec', label: 'Diesel' },
    e5: { color: '#13c388', label: 'E5' },
    e10: { color: '#e85468', label: 'E10' },
} as const;

type FuelKey = keyof typeof lineConfig;

const chartTabs: Array<{ key: ChartTabKey; label: string; caption: string }> = [
    { key: 'latest24', label: '24 Stunden', caption: 'Preise der letzten 24 Stunden' },
    { key: 'latest7', label: '7 Tage', caption: 'Preise der letzten 7 Tage' },
    { key: 'average30', label: '30 Tage', caption: 'Ø-Preise der letzten 30 Tage' },
];

const X_AXIS_TICK_COUNT = 6;
const LATEST_X_AXIS_TICK_COUNT = 7;
const LATEST_24H_POINT_COUNT = 48;
const COMPACT_X_AXIS_TICK_COUNT = 4;
const SMALL_CHART_WIDTH = 300;
const Y_AXIS_TICK_COUNT = 5;
const MINUTES_PER_DAY = 24 * 60;
const MIN_DAY_TICK_SPACING_RATIO = 0.15;
const CLOSED_LABEL_MIN_WIDTH = 75;
const CHART_MARGIN_RIGHT = 10;
const Y_AXIS_WIDTH = 60;
const X_AXIS_LEFT_PADDING = 10;
const X_AXIS_RIGHT_PADDING = 6;

const closedRangeLabelStyle = {
    position: 'center',
    fill: '#6d6d6b',
    fontSize: 11,
    fontWeight: 600,
} as const;

/**
 * Generates an array of all available fuel price values from the provided chart data
 * @param data - an array of chart points containing price values for different fuel types
 * @returns - a flat array of all diesel, e5 and e10 price values, excluding nulls and undefined
 */
function getChartValues(data: ChartPoint[]) {
    return data.flatMap((entry) => [entry.diesel, entry.e5, entry.e10]).filter((value): value is number => typeof value === 'number');
}

/**
 * Checks if a chart point has a valid price value for the specified fuel type
 * @param entry - a chart point containing price values for different fuel types
 * @param fuelKey - the fuel type key ('diesel', 'e5' or 'e10') to check for a valid price value
 * @returns - true if the chart point has a valid number price value for the specified fuel type, false otherwise
 */
function hasFuelValue(entry: ChartPoint | undefined, fuelKey: FuelKey) {
    return typeof entry?.[fuelKey] === 'number';
}

/**
 * Determines if a chart point is an isolated fuel point (i.e., has a valid price value but neighboring points do not)
 * @param data - an array of chart points containing price values for different fuel types
 * @param index - the index of the chart point to check
 * @param fuelKey - the fuel type key ('diesel', 'e5' or 'e10') to check for a valid price value
 * @returns - true if the chart point is an isolated fuel point, false otherwise
 */
function isIsolatedFuelPoint(data: ChartPoint[], index: number, fuelKey: FuelKey) {
    return hasFuelValue(data[index], fuelKey) && !hasFuelValue(data[index - 1], fuelKey) && !hasFuelValue(data[index + 1], fuelKey);
}

/**
 * Renders a dot for isolated fuel points
 * @param data - an array of chart points containing price values for different fuel types
 * @param fuelKey - the fuel type key ('diesel', 'e5' or 'e10') to check for a valid price value
 * @param color - the color of the dot
 * @returns - a SVG circle element representing the dot for an isolated fuel point
 */
function renderIsolatedFuelDot(data: ChartPoint[], fuelKey: FuelKey, color: string) {
    return ({ cx, cy, index }: DotItemDotProps) => {
        if (typeof cx !== 'number' || typeof cy !== 'number' || !isIsolatedFuelPoint(data, index, fuelKey)) {
            return null;
        }

        return <circle cx={cx} cy={cy} r={3} fill={color} stroke="#ffffff" strokeWidth={1.5} />;
    };
}

/**
 * Returns the desired number of ticks for the X-axis based on the active tab and chart width
 * @param activeTab - the currently active chart tab key
 * @param chartWidth - the current width of the chart
 * @returns - the desired number of ticks for the X-axis
 */
function getDesiredXAxisTickCount(activeTab: ChartTabKey, chartWidth: number | null) {
    if (chartWidth !== null && chartWidth < SMALL_CHART_WIDTH && activeTab !== 'latest7') {
        return COMPACT_X_AXIS_TICK_COUNT;
    }

    return activeTab === 'average30' ? X_AXIS_TICK_COUNT : LATEST_X_AXIS_TICK_COUNT;
}

/**
 * Converts a time label in the format 'HH:MM' to total minutes since midnight
 * @param label - the time label to convert
 * @returns - the total minutes since midnight, or null if the label is invalid
 */
function getLabelMinutes(label: string) {
    const [hour, minute = '0'] = label.split(':');
    const hourValue = Number(hour);
    const minuteValue = Number(minute);

    if (!Number.isFinite(hourValue) || !Number.isFinite(minuteValue)) {
        return null;
    }

    return hourValue * 60 + minuteValue;
}

/**
 * Formats a total number of minutes since midnight into an hour label in the format 'HH:00'
 * @param totalMinutes - the total number of minutes since midnight to format
 * @returns - a formatted hour label in the format 'HH:00'
 */
function formatHourFromMinutes(totalMinutes: number) {
    const normalizedMinutes = Math.round(totalMinutes) % MINUTES_PER_DAY;
    const positiveMinutes = normalizedMinutes < 0 ? normalizedMinutes + MINUTES_PER_DAY : normalizedMinutes;
    const hour = Math.floor(positiveMinutes / 60);

    return `${hour.toString().padStart(2, '0')}:00`;
}

/**
 * Formats a time label for the X-axis tick based on the provided label string
 * @param label - the time label to format, expected in the format 'HH:MM'
 * @returns - a formatted hour label in the format 'HH:00'
 */
function formatHourTick(label: string) {
    const labelMinutes = getLabelMinutes(label);

    return labelMinutes === null ? '' : formatHourFromMinutes(labelMinutes);
}

/**
 * Formats a time label for the X-axis tick based on the provided data and value
 * @param data - an array of chart points containing time labels
 * @param value - the value representing the index of the chart point to format the label for
 * @returns - a formatted hour label in the format 'HH:00'
 */
function formatLinearDayHourTick(data: ChartPoint[], value: number) {
    if (data.length < LATEST_24H_POINT_COUNT) {
        return formatHourTick(data[clamp(Math.round(value), 0, data.length - 1)]?.label ?? '');
    }

    const startMinutes = getLabelMinutes(data[0]?.label ?? '');

    if (startMinutes === null) {
        return '';
    }

    const progress = clamp(value, 0, data.length - 1) / (data.length - 1);
    return formatHourFromMinutes(startMinutes + progress * MINUTES_PER_DAY);
}

/**
 * Returns the indices of ticks for each weekday in the chart data
 * @param data - an array of chart points containing time labels and weekday labels
 * @returns - an array of indices representing the ticks for each weekday, with leading ticks removed if they are too close together
 */
function getWeekdayTicks(data: ChartPoint[]) {
    const seenDates = new Set<string>();
    const ticks = data
        .filter((entry) => {
            const dayKey = entry.tooltipLabel?.slice(0, 10) ?? entry.label;

            if (seenDates.has(dayKey)) {
                return false;
            }

            seenDates.add(dayKey);
            return true;
        })
        .map((entry) => entry.index);

    const leadingTickSpacingRatio = ticks.length > 1 && data.length > 1 ? (ticks[1] - ticks[0]) / (data.length - 1) : null;

    if (leadingTickSpacingRatio !== null && leadingTickSpacingRatio < MIN_DAY_TICK_SPACING_RATIO) {
        return ticks.slice(1);
    }

    return ticks;
}

/**
 * Calculates the width of a closed range on the chart
 * @param chartWidth - the current width of the chart
 * @param range - an object representing the start and end indices of the closed range
 * @param maxIndex - the maximum index value in the chart data
 * @returns - the calculated width of the closed range in pixels, or null if the chart width is not available or the max index is invalid
 */
function getClosedRangeWidth(chartWidth: number | null, range: ClosedRange, maxIndex: number) {
    if (chartWidth === null || maxIndex <= 0) {
        return null;
    }

    const drawableWidth = chartWidth - CHART_MARGIN_RIGHT - Y_AXIS_WIDTH - X_AXIS_LEFT_PADDING - X_AXIS_RIGHT_PADDING;
    const rangeStart = Math.max(0, range.start - 0.5);
    const rangeEnd = Math.min(maxIndex, range.end + 0.5);
    const rangeRatio = (rangeEnd - rangeStart) / maxIndex;

    return Math.max(0, drawableWidth * rangeRatio);
}

/**
 * Calculates the label for a closed range on the chart
 * @param chartWidth - the current width of the chart
 * @param range - an object representing the start and end indices of the closed range
 * @param maxIndex - the maximum index value in the chart data
 * @returns - the calculated label for the closed range, or undefined if it's too small to display
 */
function getClosedRangeLabel(chartWidth: number | null, range: ClosedRange, maxIndex: number) {
    const closedRangeWidth = getClosedRangeWidth(chartWidth, range, maxIndex);

    if (closedRangeWidth !== null && closedRangeWidth < CLOSED_LABEL_MIN_WIDTH) {
        return undefined;
    }

    return {
        ...closedRangeLabelStyle,
        value: 'geschlossen',
    };
}

/**
 * Identifies closed ranges in the chart data based on the isClosed property of each chart point
 * @param data - an array of chart points containing price values and closed status for different fuel types
 * @returns - an array of closed ranges, where each range is represented by an object containing the start and end indices of the range
 */
function getClosedRanges(data: ChartPoint[]) {
    const ranges: ClosedRange[] = [];
    let openRangeStart: number | null = null;

    data.forEach((entry, index) => {
        if (entry.isClosed && openRangeStart === null) {
            openRangeStart = index;
        }

        if ((!entry.isClosed || index === data.length - 1) && openRangeStart !== null) {
            ranges.push({
                start: openRangeStart,
                end: entry.isClosed && index === data.length - 1 ? index : index - 1,
            });
            openRangeStart = null;
        }
    });

    return ranges;
}

/**
 * Generates chart data based on the active tab and provided price data
 * @param activeTab - the currently active chart tab key
 * @param averageData - array of average price data points for the last 30 days
 * @param latestPriceData - array of latest price data points for the last 7 days and 24 hours
 * @returns - an array of chart points formatted for the LineChart component, containing price values, labels and closed status
 */
function getChartData(activeTab: ChartTabKey, averageData: StationPriceHistoryPoint[], latestPriceData: StationLatestPricePoint[]): ChartPoint[] {
    if (activeTab === 'average30') {
        return averageData.map((entry, index) => ({
            index,
            day: entry.day,
            label: entry.label,
            diesel: entry.diesel,
            e5: entry.e5,
            e10: entry.e10,
        }));
    }

    const data = activeTab === 'latest24' ? latestPriceData.slice(-LATEST_24H_POINT_COUNT) : latestPriceData.slice(-336);

    return data.map((entry, index) => ({
        index,
        date: entry.date,
        label: entry.label,
        tooltipLabel: entry.tooltipLabel,
        weekdayLabel: entry.weekdayLabel,
        diesel: entry.diesel,
        e5: entry.e5,
        e10: entry.e10,
        isClosed: entry.isClosed,
    }));
}

export default function PriceChart({ averageData, latestPriceData }: PriceChartProps) {
    const [activeTab, setActiveTab] = useState<ChartTabKey>('latest24');
    const [chartWidth, setChartWidth] = useState<number | null>(null);
    const activeTabConfig = chartTabs.find((tab) => tab.key === activeTab) ?? chartTabs[0];
    const chartData = getChartData(activeTab, averageData, latestPriceData);
    const maxIndex = chartData.length - 1;
    const values = getChartValues(chartData);
    const closedRanges = activeTab === 'latest24' ? getClosedRanges(chartData) : [];

    const xTicks = (() => {
        if (activeTab === 'latest7') {
            return getWeekdayTicks(chartData);
        }

        const desiredTickCount = getDesiredXAxisTickCount(activeTab, chartWidth);
        const xTickCount = Math.min(desiredTickCount, chartData.length);
        return createLinearTicks(0, maxIndex, xTickCount, 6);
    })();

    const xLabelFormatter = (value: number) => {
        const entry = chartData[clamp(Math.round(value), 0, maxIndex)];

        if (activeTab === 'latest7') {
            return entry?.weekdayLabel ?? '';
        }

        if (activeTab === 'latest24') {
            return formatLinearDayHourTick(chartData, value);
        }

        return entry?.label ?? '';
    };

    const renderChart = () => {
        if (chartData.length === 0 || values.length === 0) {
            return <div className="station-chart-empty">Noch keine Preisdaten verfügbar.</div>;
        }

        const minimumValue = Math.min(...values);
        const maximumValue = Math.max(...values);
        const padding = Math.max(0.015, (maximumValue - minimumValue) * 0.2 || 0.03);
        const lowerPadding = padding + 0.01;
        const upperPadding = padding;
        const yTicks = createLinearTicks(minimumValue - lowerPadding, maximumValue + upperPadding, Y_AXIS_TICK_COUNT, 6);

        return (
            <ResponsiveContainer
                width="100%"
                height={220}
                onResize={(width) => {
                    setChartWidth((currentWidth) => (currentWidth === width ? currentWidth : width));
                }}
            >
                <LineChart data={chartData} margin={{ top: 18, right: 10, bottom: 8, left: 0 }}>
                    <CartesianGrid stroke="#00000012" strokeDasharray="3 3" vertical={false} />
                    {closedRanges.map((range) => (
                        <ReferenceArea
                            key={`${range.start}-${range.end}`}
                            x1={Math.max(0, range.start - 0.5)}
                            x2={Math.min(maxIndex, range.end + 0.5)}
                            fill="#8f8f8f"
                            fillOpacity={0.14}
                            strokeOpacity={0}
                            label={getClosedRangeLabel(chartWidth, range, maxIndex)}
                        />
                    ))}
                    <XAxis
                        type="number"
                        dataKey="index"
                        domain={[0, maxIndex]}
                        ticks={xTicks}
                        tickFormatter={xLabelFormatter}
                        tick={{ fontSize: 12, fill: '#5d5d5b' }}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        interval={0}
                        allowDecimals
                        padding={{ left: 10, right: 6 }}
                    />
                    <YAxis
                        domain={[yTicks[0], yTicks[yTicks.length - 1]]}
                        ticks={yTicks}
                        tickFormatter={(value) => `${value.toFixed(2)} €`}
                        tick={{ fontSize: 12, fill: '#5d5d5b' }}
                        tickLine={false}
                        axisLine={false}
                        interval={0}
                        width={60}
                    />
                    <Tooltip
                        formatter={(value: ValueType | undefined, name: NameType | undefined) => {
                            const normalizedValue = typeof value === 'number' ? value : null;
                            const normalizedName =
                                typeof name === 'string' && name in lineConfig ? lineConfig[name as keyof typeof lineConfig].label : (name ?? '');

                            return [formatPrice(normalizedValue), normalizedName];
                        }}
                        labelFormatter={(value) => {
                            const entry = chartData[clamp(Number(value), 0, maxIndex)];

                            return activeTab === 'average30' ? formatTooltipDay(entry?.day ?? '') : (entry?.tooltipLabel ?? '');
                        }}
                        contentStyle={{
                            borderRadius: '16px',
                            border: '1px solid rgba(0, 0, 0, 0.08)',
                            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
                            padding: '10px 12px',
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="diesel"
                        stroke={lineConfig.diesel.color}
                        strokeWidth={3}
                        dot={activeTab === 'latest24' ? renderIsolatedFuelDot(chartData, 'diesel', lineConfig.diesel.color) : false}
                        activeDot={{ r: 4 }}
                        connectNulls={activeTab !== 'latest24'}
                        isAnimationActive={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="e5"
                        stroke={lineConfig.e5.color}
                        strokeWidth={3}
                        dot={activeTab === 'latest24' ? renderIsolatedFuelDot(chartData, 'e5', lineConfig.e5.color) : false}
                        activeDot={{ r: 4 }}
                        connectNulls={activeTab !== 'latest24'}
                        isAnimationActive={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="e10"
                        stroke={lineConfig.e10.color}
                        strokeWidth={3}
                        dot={activeTab === 'latest24' ? renderIsolatedFuelDot(chartData, 'e10', lineConfig.e10.color) : false}
                        activeDot={{ r: 4 }}
                        connectNulls={activeTab !== 'latest24'}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        );
    };

    return (
        <>
            <div className="station-chart-tabs" role="tablist" aria-label="Preisverlauf auswählen">
                {chartTabs.map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === tab.key}
                        className={`station-chart-tab ${activeTab === tab.key ? 'station-chart-tab-active' : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div key={activeTab} className="station-chart-panel">
                <span className="station-large-caption">{activeTabConfig.caption}</span>
                {renderChart()}
            </div>
        </>
    );
}
