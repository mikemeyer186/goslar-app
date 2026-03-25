import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { StationPriceHistoryPoint } from '../interfaces/dailyAverage';

interface PriceChartProps {
    data: StationPriceHistoryPoint[];
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

const X_AXIS_TICK_COUNT = 6;
const Y_AXIS_TICK_COUNT = 5;

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

function roundTick(value: number, precision: number) {
    return Number(value.toFixed(precision));
}

function createLinearTicks(start: number, end: number, count: number, precision: number) {
    if (count <= 1 || start === end) {
        return [roundTick(start, precision)];
    }

    const step = (end - start) / (count - 1);

    return Array.from({ length: count }, (_, index) => {
        if (index === count - 1) {
            return roundTick(end, precision);
        }

        return roundTick(start + step * index, precision);
    });
}

function formatTooltipDay(day: string) {
    if (!day) {
        return '';
    }

    const [year, month, dayOfMonth] = day.split('-');
    return `${dayOfMonth}.${month}.${year}`;
}

function formatPrice(value: number | null) {
    if (value === null || Number.isNaN(value)) {
        return '-';
    }

    return `${value.toFixed(2).replace('.', ',')} €`;
}

export default function PriceChart({ data }: PriceChartProps) {
    const chartData = data.map((entry, index) => ({ ...entry, index }));
    const maxIndex = chartData.length - 1;
    const xTickCount = Math.min(X_AXIS_TICK_COUNT, chartData.length);
    const xTicks = createLinearTicks(0, maxIndex, xTickCount, 6);
    const values = data.flatMap((entry) => [entry.diesel, entry.e5, entry.e10]).filter((value): value is number => typeof value === 'number');
    const minimumValue = Math.min(...values);
    const maximumValue = Math.max(...values);
    const padding = Math.max(0.015, (maximumValue - minimumValue) * 0.2 || 0.03);
    const lowerPadding = padding + 0.01;
    const upperPadding = padding;
    const yTicks = createLinearTicks(minimumValue - lowerPadding, maximumValue + upperPadding, Y_AXIS_TICK_COUNT, 3);
    const xLabelFormatter = (value: number) => chartData[clamp(Math.round(value), 0, maxIndex)]?.label ?? '';

    if (data.length === 0 || values.length === 0) {
        return <div className="station-chart-empty">Noch keine Preisdaten verfügbar.</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 18, right: 10, bottom: 8, left: 0 }}>
                <CartesianGrid stroke="#00000012" strokeDasharray="3 3" vertical={false} />
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
                    width={60}
                />
                <Tooltip
                    formatter={(value: ValueType | undefined, name: NameType | undefined) => {
                        const normalizedValue = typeof value === 'number' ? value : null;
                        const normalizedName =
                            typeof name === 'string' && name in lineConfig ? lineConfig[name as keyof typeof lineConfig].label : (name ?? '');

                        return [formatPrice(normalizedValue), normalizedName];
                    }}
                    labelFormatter={(value) => formatTooltipDay(chartData[clamp(Number(value), 0, maxIndex)]?.day ?? '')}
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
                    connectNulls
                />
                <Line type="monotone" dataKey="e5" stroke={lineConfig.e5.color} strokeWidth={3} dot={false} activeDot={{ r: 4 }} connectNulls />
                <Line type="monotone" dataKey="e10" stroke={lineConfig.e10.color} strokeWidth={3} dot={false} activeDot={{ r: 4 }} connectNulls />
            </LineChart>
        </ResponsiveContainer>
    );
}
