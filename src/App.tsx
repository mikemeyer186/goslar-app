import { useEffect, useRef, useState } from 'react';
import { loadCurrentFuelPrices } from './services/firebase';
import Station from './interfaces/station';
import TileStation from './components/stationTile';
import Navbar from './components/navbar';
import Toolbar from './components/toolbar';

export default function App() {
    const [fuelStations, setFuelStations] = useState<Station[]>([]);
    const [lastUpdate, setLastUpdate] = useState<string>('');
    const didInit = useRef(false);
    const [isLoaded, setIsLoaded] = useState(false);

    async function loadPrices() {
        const stationsData = await loadCurrentFuelPrices();
        setFuelStations(stationsData?.data);
        setLastUpdate(
            new Date(stationsData?.updated.seconds * 1000).toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            })
        );
        setIsLoaded(true);
        console.log(stationsData);
    }

    useEffect(() => {
        if (!didInit.current) {
            loadPrices();
            didInit.current = true;
        }
    }, []);

    return (
        <main>
            <Navbar></Navbar>

            <Toolbar></Toolbar>

            <section className="station-container">
                {isLoaded ? (
                    <>
                        {fuelStations.map((station: Station) => {
                            return <TileStation key={station.id} station={station} updated={lastUpdate} />;
                        })}
                    </>
                ) : (
                    <div>Tankstellen werden geladen...</div>
                )}
            </section>
        </main>
    );
}
