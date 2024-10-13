import { useEffect, useRef, useState } from 'react';
import { loadCurrentFuelPrices } from './services/firebase';
import Station from './interfaces/station';
import TileStation from './components/stationTile';
import Toolbar from './components/toolbar';
import Spinner from './components/spinner';
import Footer from './components/footer';

export default function App() {
    const [fuelStations, setFuelStations] = useState<Station[]>([]);
    const [lastUpdate, setLastUpdate] = useState<string>('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeSelection, setActiveSelection] = useState<FuelSelection>('diesel');
    const [showOnlyOpenStations, setShowOnlyOpenStations] = useState(true);
    const [selectedCities, setSelectedCities] = useState<string[]>([]);
    const [isFiltered, setIsFiltered] = useState<boolean>(false);
    const didInit = useRef(false);
    let sortedFuelStations: Station[] = [];
    let openStations: Station[] = [];
    let filteredFuelStations: Station[] = [];
    type FuelSelection = 'e5' | 'e10' | 'diesel';

    async function handlePriceLoading() {
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
        setTimeout(() => {
            setIsLoaded(true);
        }, 1500);
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
            handlePriceLoading();
            didInit.current = true;
        }
    }, []);

    useEffect(() => {
        if (selectedCities.length > 0) {
            setIsFiltered(true);
        } else {
            setIsFiltered(false);
        }
    }, [selectedCities]);

    // sorting of stations by pice (selected fuel button)
    sortedFuelStations = fuelStations
        .slice()
        .sort((a: Station, b: Station) => a[activeSelection] - b[activeSelection])
        .filter((station: Station) => station[activeSelection] > 0);

    // filters only open stations (toggle)
    if (showOnlyOpenStations) {
        openStations = sortedFuelStations.filter((station: Station) => station.isOpen);
    } else {
        openStations = sortedFuelStations;
    }

    // filters selected stations by cities (filter menu)
    if (isFiltered) {
        filteredFuelStations = openStations.filter((station: Station) => selectedCities.includes(station.place));
    } else {
        filteredFuelStations = openStations;
    }

    return (
        <main>
            <section className="station-container">
                {isLoaded ? (
                    <>
                        <Toolbar
                            onFuelSelection={onFuelSelection}
                            activeSelection={activeSelection}
                            onSliderMove={onSliderMove}
                            showOnlyOpenStations={showOnlyOpenStations}
                            openStations={openStations}
                            selectedCities={selectedCities}
                            setSelectedCities={setSelectedCities}
                            isFiltered={isFiltered}
                        ></Toolbar>

                        {filteredFuelStations.map((station: Station) => {
                            return <TileStation key={station.id} station={station} activeSelection={activeSelection} />;
                        })}

                        <Footer updated={lastUpdate} />
                    </>
                ) : (
                    <Spinner />
                )}
            </section>
        </main>
    );
}
