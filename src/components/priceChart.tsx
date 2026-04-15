import { useState } from 'react';
import { CartesianGrid, Line, LineChart, ReferenceArea, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
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
const CLOSED_LABEL_ROTATE_WIDTH = 300;

const closedRangeLabelStyle = {
    position: 'center',
    fill: '#6d6d6b',
    fontSize: 11,
    fontWeight: 600,
} as const;

function getChartValues(data: ChartPoint[]) {
    return data.flatMap((entry) => [entry.diesel, entry.e5, entry.e10]).filter((value): value is number => typeof value === 'number');
}

function getDesiredXAxisTickCount(activeTab: ChartTabKey, chartWidth: number | null) {
    if (chartWidth !== null && chartWidth < SMALL_CHART_WIDTH && activeTab !== 'latest7') {
        return COMPACT_X_AXIS_TICK_COUNT;
    }

    return activeTab === 'average30' ? X_AXIS_TICK_COUNT : LATEST_X_AXIS_TICK_COUNT;
}

function getLabelMinutes(label: string) {
    const [hour, minute = '0'] = label.split(':');
    const hourValue = Number(hour);
    const minuteValue = Number(minute);

    if (!Number.isFinite(hourValue) || !Number.isFinite(minuteValue)) {
        return null;
    }

    return hourValue * 60 + minuteValue;
}

function formatHourFromMinutes(totalMinutes: number) {
    const normalizedMinutes = Math.round(totalMinutes) % MINUTES_PER_DAY;
    const positiveMinutes = normalizedMinutes < 0 ? normalizedMinutes + MINUTES_PER_DAY : normalizedMinutes;
    const hour = Math.floor(positiveMinutes / 60);

    return `${hour.toString().padStart(2, '0')}:00`;
}

function formatHourTick(label: string) {
    const labelMinutes = getLabelMinutes(label);

    return labelMinutes === null ? '' : formatHourFromMinutes(labelMinutes);
}

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

function getClosedRangeLabel(chartWidth: number | null) {
    if (chartWidth !== null && chartWidth <= CLOSED_LABEL_ROTATE_WIDTH) {
        return {
            ...closedRangeLabelStyle,
            value: 'geschlossen',
            angle: 90,
        };
    }

    return {
        ...closedRangeLabelStyle,
        value: 'geschlossen',
    };
}

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
                            label={getClosedRangeLabel(chartWidth)}
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
                        dot={false}
                        activeDot={{ r: 4 }}
                        connectNulls={activeTab !== 'latest24'}
                        isAnimationActive={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="e5"
                        stroke={lineConfig.e5.color}
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 4 }}
                        connectNulls={activeTab !== 'latest24'}
                        isAnimationActive={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="e10"
                        stroke={lineConfig.e10.color}
                        strokeWidth={3}
                        dot={false}
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
