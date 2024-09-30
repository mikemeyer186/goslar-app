import { useState } from 'react';
import Station from './interfaces/station';
import './App.css';

function App() {
    const [output, setOutput] = useState<Station[]>([]);
    const [containerOutput, setContainerOutput] = useState<Station[]>([]);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const apiUrl = import.meta.env.VITE_API_URL;
    const contUrl = import.meta.env.VITE_CONTAINER_URL;
    const contKey = import.meta.env.VITE_CONTAINER_API_KEY;

    async function requestContainer() {
        try {
            const response = await fetch(contUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': contKey,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const stations = await response.json();
            setContainerOutput(stations.data);
            setLastUpdate(new Date(stations.updated._seconds * 1000));
        } catch (error) {
            console.error('Fehler beim Abrufen der Spritpreise:', error);
        }
    }

    async function requestPrices() {
        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // API-key
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            } else {
                const stations = await response.json();
                setOutput(stations.data);
                setLastUpdate(new Date(stations.updated._seconds * 1000));
            }
        } catch (error) {
            console.error('Fehler beim Abrufen der Spritpreise:', error);
        }
    }

    return (
        <>
            <button onClick={requestPrices}>Request Cloud Function</button>
            <button onClick={requestContainer}>Request Cloud Run</button>
            <p>Letzte Aktualisierung:</p>
            {lastUpdate.toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            })}
            <p></p>

            <div className="stations-container">
                {output.map((station) => {
                    return (
                        <div className="station" key={station.id}>
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

            <div className="stations-container">
                {containerOutput.map((station) => {
                    return (
                        <div className="station" key={station.id}>
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
