import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { StationPriceHistoryPoint } from '../interfaces/dailyAverage';

interface PriceChartProps {
    data: StationPriceHistoryPoint[];
}

const lineConfig = {
    diesel: { color: '#2563eb', label: 'Diesel' },
    e5: { color: '#0f9f6e', label: 'E5' },
    e10: { color: '#ef6c3d', label: 'E10' },
} as const;

function formatPrice(value: number | null) {
    if (value === null || Number.isNaN(value)) {
        return '-';
    }

    return `${value.toFixed(3).replace('.', ',')} €`;
}

export default function PriceChart({ data }: PriceChartProps) {
    if (data.length === 0) {
        return <div className="station-chart-empty">Noch keine 30-Tage-Preisdaten verfügbar.</div>;
    }

    const tickStep = Math.max(1, Math.floor(data.length / 5));
    const xTicks = Array.from(new Set(data.filter((_, index) => index % tickStep === 0 || index === data.length - 1).map((entry) => entry.day)));
    const labelMap = new Map(data.map((entry) => [entry.day, entry.label]));
    const values = data.flatMap((entry) => [entry.diesel, entry.e5, entry.e10]).filter((value): value is number => typeof value === 'number');

    if (values.length === 0) {
        return <div className="station-chart-empty">Noch keine 30-Tage-Preisdaten verfügbar.</div>;
    }

    const minimumValue = Math.min(...values);
    const maximumValue = Math.max(...values);
    const padding = Math.max(0.015, (maximumValue - minimumValue) * 0.2 || 0.03);
    const lowerPadding = padding + 0.01;
    const upperPadding = padding;

    return (
        <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data} margin={{ top: 18, right: 10, bottom: 8, left: 0 }}>
                <CartesianGrid stroke="#00000012" strokeDasharray="3 3" vertical={false} />
                <XAxis
                    dataKey="day"
                    ticks={xTicks}
                    tickFormatter={(value) => labelMap.get(value) ?? value}
                    tick={{ fontSize: 12, fill: '#5d5d5b' }}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    minTickGap={18}
                    padding={{ left: 10, right: 6 }}
                />
                <YAxis
                    domain={[minimumValue - lowerPadding, maximumValue + upperPadding]}
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
                    labelFormatter={(value) => `Tag: ${labelMap.get(value) ?? value}`}
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
