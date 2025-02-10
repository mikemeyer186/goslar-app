import { useEffect, useRef, useState } from 'react';
import { loadCurrentFuelPrices, loadHistoricFuelPrices } from '../services/firebase';
import { useSearchParams } from 'react-router-dom';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import Station from '../interfaces/station';
import HistoricData from '../interfaces/historic-data';
import HistoricPrices from '../interfaces/historic-prices';
import TileStation from './stationTile';
import Toolbar from './toolbar';
import Spinner from './spinner';
import Footer from './footer';
import Imprint from './imprint';
import DataProtection from './dataprotection';
import Disclaimer from './disclaimer';

export default function Overview() {
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
    const [searchParams] = useSearchParams('');
    const didInit = useRef(false);
    let sortedFuelStations: Station[] = [];
    let openStations: Station[] = [];
    let filteredFuelStations: Station[] = [];
    type FuelSelection = 'e5' | 'e10' | 'diesel';

    const [isAllConsentsAccepted, setAllConsentsAccepted] = useState<boolean>(() => {
        const ucData = localStorage.getItem('uc_settings');
        if (ucData) {
            try {
                const ucDataParsed = JSON.parse(ucData);
                const ucServices = ucDataParsed.services;
                return Array.isArray(ucServices) && ucServices.every((service: { status: boolean }) => service.status === true);
            } catch (error) {
                console.error('Error while parsing uc_settings:', error);
            }
        }
        return false;
    });
    const prevConsentRef = useRef(isAllConsentsAccepted);

    function handleClickEvent(e: MouseEvent) {
        const eventPath = e.composedPath();
        const bannerClicked = eventPath.some((node) => node instanceof HTMLElement && node.id === 'uc-center-container');

        if (bannerClicked) {
            setTimeout(() => {
                const ucData = localStorage.getItem('uc_settings');

                if (ucData) {
                    const ucDataParsed = JSON.parse(ucData);
                    const ucServices = ucDataParsed.services;
                    const newConsentStatus = Array.isArray(ucServices) && ucServices.every((service: { status: boolean }) => service.status === true);
                    setAllConsentsAccepted(newConsentStatus);
                }
            }, 1000);
        }
    }

    function startEventListener() {
        document.addEventListener('click', handleClickEvent);

        return () => {
            document.removeEventListener('click', handleClickEvent);
        };
    }

    async function handleConsentLoading() {
        const params = searchParams.get('externalconsent');
        if (!params) {
            await handleConsentBannerLoad();
            window.addEventListener('UC_UI_INITIALIZED', function () {
                startEventListener();
                if (UC_UI.areAllConsentsAccepted()) {
                    handlePriceLoading();
                }
            });
        } else {
            handlePriceLoading();
        }
    }

    async function handleConsentBannerLoad() {
        const script = document.createElement('script');
        script.id = 'usercentrics-cmp';
        script.async = true;
        script.setAttribute('data-eu-mode', 'true');
        script.setAttribute('data-settings-id', import.meta.env.VITE_USERCENTRICS_SETTINGS_ID || '');
        script.src = 'https://app.eu.usercentrics.eu/browser-ui/latest/loader.js';
        document.head.appendChild(script);
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
            handleConsentLoading();
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

    useEffect(() => {
        if (prevConsentRef.current !== isAllConsentsAccepted) {
            location.reload();
        }
        prevConsentRef.current = isAllConsentsAccepted;
    }, [isAllConsentsAccepted]);

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
                        <Spinner isAllConsentsAccepted={isAllConsentsAccepted} />
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
