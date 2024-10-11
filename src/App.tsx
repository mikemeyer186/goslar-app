import { useEffect, useRef, useState } from 'react';
import { loadCurrentFuelPrices } from './services/firebase';
import Station from './interfaces/station';
import TileStation from './components/stationTile';
import Toolbar from './components/toolbar';

export default function App() {
    const [fuelStations, setFuelStations] = useState<Station[]>([]);
    const [lastUpdate, setLastUpdate] = useState<string>('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeSelection, setActiveSelection] = useState<FuelSelection>('diesel');
    const [showOnlyOpenStations, setShowOnlyOpenStations] = useState(true);
    const didInit = useRef(false);
    let sortedFuelStations: Station[] = [];
    let filteredFuelStations: Station[] = [];
    type FuelSelection = 'e5' | 'e10' | 'diesel';

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

    function onFuelSelection(selection: FuelSelection) {
        setActiveSelection(selection);
    }

    function onSliderMove() {
        if (showOnlyOpenStations) {
            setShowOnlyOpenStations(false);
        } else {
            setShowOnlyOpenStations(true);
        }
    }

    useEffect(() => {
        if (!didInit.current) {
            loadPrices();
            didInit.current = true;
        }
    }, []);

    sortedFuelStations = fuelStations
        .slice()
        .sort((a: Station, b: Station) => a[activeSelection] - b[activeSelection])
        .filter((station: Station) => station[activeSelection] > 0);

    if (showOnlyOpenStations) {
        filteredFuelStations = sortedFuelStations.filter((station: Station) => station.isOpen);
    } else {
        filteredFuelStations = sortedFuelStations;
    }

    return (
        <main>
            <Toolbar
                onFuelSelection={onFuelSelection}
                activeSelection={activeSelection}
                onSliderMove={onSliderMove}
                showOnlyOpenStations={showOnlyOpenStations}
            ></Toolbar>

            <section className="station-container">
                {isLoaded ? (
                    <>
                        {filteredFuelStations.map((station: Station) => {
                            return <TileStation key={station.id} station={station} updated={lastUpdate} activeSelection={activeSelection} />;
                        })}
                    </>
                ) : (
                    <div>Tankstellen werden geladen...</div>
                )}
            </section>
        </main>
    );
}
