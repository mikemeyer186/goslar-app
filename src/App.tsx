import { useEffect, useRef, useState } from 'react';
import { loadCurrentFuelPrices, loadHistoricFuelPrices } from './services/firebase';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import Station from './interfaces/station';
import HistoricData from './interfaces/historic-data';
import HistoricPrices from './interfaces/historic-prices';
import TileStation from './components/stationTile';
import Toolbar from './components/toolbar';
import Spinner from './components/spinner';
import Footer from './components/footer';
import Imprint from './components/imprint';
import DataProtection from './components/dataprotection';
import Disclaimer from './components/disclaimer';

export default function App() {
    const [itemParent] = useAutoAnimate({ duration: 150, easing: 'ease-in' });
    const [fuelStations, setFuelStations] = useState<Station[]>([]);
    const [historicPrices1Day, setHistoricPrices1Day] = useState<HistoricPrices[]>([]);
    const [historicPrices7Days, setHistoricPrices7Days] = useState<HistoricPrices[]>([]);
    const [lastUpdate, setLastUpdate] = useState<string>('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeSelection, setActiveSelection] = useState<FuelSelection>('diesel');
    const [showOnlyOpenStations, setShowOnlyOpenStations] = useState(true);
    const [selectedCities, setSelectedCities] = useState<string[]>([]);
    const [isFiltered, setIsFiltered] = useState<boolean>(false);
    const [isImprintOpen, setIsImprintOpen] = useState(false);
    const [isDatProOpen, setIsDatProOpen] = useState(false);
    const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
    const didInit = useRef(false);
    let sortedFuelStations: Station[] = [];
    let openStations: Station[] = [];
    let filteredFuelStations: Station[] = [];
    type FuelSelection = 'e5' | 'e10' | 'diesel';

    async function consentLoading() {
        setTimeout(() => {
            if (UC_UI) {
                if (UC_UI.areAllConsentsAccepted()) {
                    handlePriceLoading();
                    console.log('accepted');
                } else {
                    window.addEventListener('onAcceptAllServices', function () {
                        handlePriceLoading();
                        console.log('accepted');
                    });
                }
            } else {
                window.addEventListener('UC_UI_INITIALIZED', function (event) {
                    console.log(event);
                });
            }
        }, 1000);
    }

    async function handlePriceLoading() {
        const stationsData = await loadCurrentFuelPrices();
        const historicData = await loadHistoricFuelPrices();

        setFuelStations(stationsData?.data);
        setLastUpdate(stationsData?.updated);
        handleHistoricDataFiltering(historicData as HistoricData, stationsData?.updated);
        setTimeout(() => {
            setIsLoaded(true);
        }, 1500);
    }

    function handleHistoricDataFiltering(historicData: HistoricData, updated: string) {
        const parsedTimestamp = parseTimestamp(updated);
        const timestamp1DayBack: string = new Date(parsedTimestamp.setDate(parsedTimestamp.getDate() - 1)).toLocaleString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Europe/Berlin',
        });
        const timestamp7DaysBack: string = new Date(parsedTimestamp.setDate(parsedTimestamp.getDate() - 7)).toLocaleString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Europe/Berlin',
        });

        setHistoricPrices1Day(historicData[timestamp1DayBack]);
        setHistoricPrices7Days(historicData[timestamp7DaysBack]);
    }

    function onFuelSelection(selection: FuelSelection) {
        setActiveSelection(selection);
    }

    function parseTimestamp(dateString: string) {
        const [datePart, timePart] = dateString.split(', ');
        const [dayStr, monthStr, yearStr] = datePart.split('.');
        const [hoursStr, minutesStr] = timePart.split(':');
        const day = parseInt(dayStr, 10);
        const month = parseInt(monthStr, 10);
        const year = parseInt(yearStr, 10);
        const hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);
        const date = new Date(year, month - 1, day, hours, minutes);
        return date;
    }

    function onSliderMove() {
        if (showOnlyOpenStations) {
            setShowOnlyOpenStations(false);
        } else {
            setShowOnlyOpenStations(true);
        }
    }

    function openModal(modal: string) {
        document.body.classList.add('overflow-hidden');
        if (modal === 'imprint') {
            setIsImprintOpen(true);
        } else if (modal === 'datpro') {
            setIsDatProOpen(true);
        } else if (modal === 'disclaimer') {
            setIsDisclaimerOpen(true);
        }
    }

    function closeModal(modal: string) {
        document.body.classList.remove('overflow-hidden');
        if (modal === 'imprint') {
            setIsImprintOpen(false);
        } else if (modal === 'datpro') {
            setIsDatProOpen(false);
        } else if (modal === 'disclaimer') {
            setIsDisclaimerOpen(false);
        }
    }

    useEffect(() => {
        if (!didInit.current) {
            consentLoading();
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

    // sorting of stations by price (selected fuel button)
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
        filteredFuelStations = openStations.filter((station: Station) =>
            selectedCities.some((city) => station.place.toLowerCase().includes(city.toLowerCase()))
        );
    } else {
        filteredFuelStations = openStations;
    }

    return (
        <>
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

                            <div className="station-wrapper" ref={itemParent}>
                                {filteredFuelStations.map((station: Station) => {
                                    return (
                                        <TileStation
                                            key={station.id}
                                            station={station}
                                            activeSelection={activeSelection}
                                            prices1Day={historicPrices1Day.find((prices) => prices.id === station.id)}
                                            prices7Days={historicPrices7Days.find((prices) => prices.id === station.id)}
                                        />
                                    );
                                })}
                            </div>

                            <Footer updated={lastUpdate} openModal={openModal} />
                        </>
                    ) : (
                        <Spinner />
                    )}
                </section>
            </main>

            {isImprintOpen && (
                <div className="imprint-modal fade-effect">
                    <Imprint closeModal={closeModal}></Imprint>
                </div>
            )}

            {isDatProOpen && (
                <div className="datpro-modal fade-effect">
                    <DataProtection closeModal={closeModal}></DataProtection>
                </div>
            )}

            {isDisclaimerOpen && (
                <div className="disclaimer-modal fade-effect">
                    <Disclaimer closeModal={closeModal}></Disclaimer>
                </div>
            )}
        </>
    );
}
