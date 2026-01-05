import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
// interface StationTileProps {
//     updated: string;
//     openModal: CallableFunction;
// }

const data = [
    {
        name: '03.01.',
        Diesel: 1.52,
        E5: 1.72,
        E10: 1.78,
    },
    {
        name: '04.01.',
        Diesel: 1.55,
        E5: 1.75,
        E10: 1.8,
    },
    {
        name: '05.01.',
        Diesel: 1.58,
        E5: 1.78,
        E10: 1.82,
    },
];

export default function PriceChart() {
    return (
        <ResponsiveContainer width="100%" height={128} style={{ appearance: 'none' }}>
            <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} style={{ appearance: 'none' }}>
                <CartesianGrid strokeDasharray="2 2" />
                <XAxis
                    dataKey="name"
                    style={{ fontSize: '12px' }}
                    stroke="#3f3f3e"
                    label={{ value: '⌀-Tagespreise', position: 'right', dx: -70, dy: -78, fontSize: 10, fontWeight: '300' }}
                />
                <YAxis
                    style={{ fontSize: '12px' }}
                    type="number"
                    tickCount={3}
                    domain={[1.3, 2.3]}
                    tickFormatter={(value) => value.toFixed(2)}
                    unit="€"
                    stroke="#3f3f3e"
                />
                <Legend
                    wrapperStyle={{
                        height: '20px',
                        margin: '0px',
                        padding: '0px',
                        width: '200px',
                        right: 0,
                        top: -15,
                        fontSize: '13px',
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}
                />
                <Line type="monotone" dataKey="Diesel" stroke="#0a039bff" />
                <Line type="monotone" dataKey="E5" stroke="#008b36ff" />
                <Line type="monotone" dataKey="E10" stroke="#a70202ff" />
            </LineChart>
        </ResponsiveContainer>
    );
}
