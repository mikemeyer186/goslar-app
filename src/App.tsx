import { useState } from 'react';
import Station from './interfaces/station';
import './App.css';

function App() {
    const [containerOutput, setContainerOutput] = useState<Station[]>([]);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const apiUrl = import.meta.env.VITE_CONTAINER_URL;
    const apiKey = import.meta.env.VITE_CONTAINER_API_KEY;

    async function requestStations(range: string) {
        try {
            const response = await fetch(apiUrl + range, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const stations = await response.json();

            if (range === 'cheapest') {
                const stationsArray: Station[] = Object.values(stations.data);
                setContainerOutput(stationsArray);
            } else {
                setContainerOutput(stations.data);
            }

            setLastUpdate(new Date(stations.updated._seconds * 1000));
        } catch (error) {
            console.error('Fehler beim Abrufen der Spritpreise:', error);
        }
    }

    return (
        <>
            <button onClick={() => requestStations('all')}>Alle Tankstellen</button>
            <button onClick={() => requestStations('cheapest')}>Günstigste Tankstellen</button>

            <p>Letzte Aktualisierung:</p>
            {lastUpdate.toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            })}

            <div className="stations-container">
                {containerOutput.map((station, index) => {
                    return (
                        <div className="station" key={index}>
                            <div>
                                <strong>{station.brand}</strong>
                            </div>
                            <div>
                                {station.street} {station.houseNumber}
                            </div>
                            <div>{station.place}</div>
                            <div>Diesel: {station.diesel}</div>
                            <div>E5: {station.e5}</div>
                            <div>E10: {station.e10}</div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default App;
