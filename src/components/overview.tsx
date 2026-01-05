import { useEffect, useRef, useState } from 'react';
import { loadCurrentFuelPrices, loadDailyAverages } from '../services/firebase';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import Station from '../interfaces/station';
import TileStation from './stationTile';
import Toolbar from './toolbar';
import Spinner from './spinner';
import Footer from './footer';
import Imprint from './imprint';
import DataProtection from './dataprotection';
import Disclaimer from './disclaimer';

export default function Overview() {
    const [itemParent] = useAutoAnimate({ duration: 150, easing: 'ease-in' });
    const [searchParams] = useSearchParams('');
    const [fuelStations, setFuelStations] = useState<Station[]>([]);
    const [lastUpdate, setLastUpdate] = useState<string>('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeSelection, setActiveSelection] = useState<FuelSelection>('diesel');
    const [showOnlyOpenStations, setShowOnlyOpenStations] = useState(true);
    const [selectedCities, setSelectedCities] = useState<string[]>([]);
    const [isFiltered, setIsFiltered] = useState<boolean>(false);
    const [isImprintOpen, setIsImprintOpen] = useState(searchParams.get('target') === 'imprint' ? true : false);
    const [isDatProOpen, setIsDatProOpen] = useState(searchParams.get('target') === 'dataprotection' ? true : false);
    const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
    const navigate = useNavigate();
    const didInit = useRef(false);
    let sortedFuelStations: Station[] = [];
    let openStations: Station[] = [];
    let filteredFuelStations: Station[] = [];
    type FuelSelection = 'e5' | 'e10' | 'diesel';

    /**
     * checks if all services of usercentrics are accepted
     * and sets the state on initial loading
     */
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

    /**
     * handles the click event on usercentrics consent banner
     * checks on every click if all services of usercentrics are accepted
     * the timeout of 1000 ms is necessary to avoid write/read gap
     * @param e - event
     */
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

    /**
     * starts the click event listener on initial loading
     * @returns - unsubscribe
     */
    function startEventListener() {
        document.addEventListener('click', handleClickEvent);

        return () => {
            document.removeEventListener('click', handleClickEvent);
        };
    }

    /**
     * checks the url parameters and loads usercentrics banner
     * if user comes from goslar-app, no banner will be loaded
     */
    async function handleConsentLoading() {
        const externalConsentParam = searchParams.get('externalconsent');
        const originParam = searchParams.get('origin');
        const originKey = import.meta.env.VITE_URL_PARAMETER_ORIGIN;

        if (externalConsentParam && originParam === originKey) {
            handlePriceLoading();
        } else {
            await handleConsentBannerLoad();
            window.addEventListener('UC_UI_INITIALIZED', function () {
                startEventListener();
                if (UC_UI.areAllConsentsAccepted()) {
                    handlePriceLoading();
                }
            });
        }
    }

    /**
     * loads the usercentrics banner via script by adding to document head
     */
    async function handleConsentBannerLoad() {
        const script = document.createElement('script');
        script.id = 'usercentrics-cmp';
        script.async = true;
        script.setAttribute('data-eu-mode', 'true');
        script.setAttribute('data-settings-id', import.meta.env.VITE_USERCENTRICS_SETTINGS_ID || '');
        script.src = 'https://app.eu.usercentrics.eu/browser-ui/latest/loader.js';
        document.head.appendChild(script);
    }

    /**
     * loads the current prices from firestore
     */
    async function handlePriceLoading() {
        const stationsData = await loadCurrentFuelPrices();
        const dailyAverages = await loadDailyAverages();
        console.log(dailyAverages);
        setFuelStations(stationsData?.data);
        setLastUpdate(stationsData?.updated);
        setTimeout(() => {
            setIsLoaded(true);
        }, 1500);
    }

    /**
     * sets the selected fuel type
     * @param selection - fuel type
     */
    function onFuelSelection(selection: FuelSelection) {
        setActiveSelection(selection);
    }

    /**
     * sets the station filter (open/closed)
     */
    function onSliderMove() {
        if (showOnlyOpenStations) {
            setShowOnlyOpenStations(false);
        } else {
            setShowOnlyOpenStations(true);
        }
    }

    /**
     * opens the modal from footer links
     * @param modal - model as string
     */
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

    /**
     * closes the modal
     * @param modal - modal as string
     */
    function closeModal(modal: string) {
        document.body.classList.remove('overflow-hidden');
        if (modal === 'imprint') {
            setIsImprintOpen(false);
            navigate('/');
            location.reload();
        } else if (modal === 'datpro') {
            setIsDatProOpen(false);
            navigate('/');
            location.reload();
        } else if (modal === 'disclaimer') {
            setIsDisclaimerOpen(false);
            navigate('/');
        }
    }

    /**
     * inital loading of component
     */
    useEffect(() => {
        if (!didInit.current) {
            handleConsentLoading();
            didInit.current = true;
        }
    }, []);

    /**
     * sets the filter status
     */
    useEffect(() => {
        if (selectedCities.length > 0) {
            setIsFiltered(true);
        } else {
            setIsFiltered(false);
        }
    }, [selectedCities]);

    /**
     * checks if the user changed consent accept and reloads the page
     */
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
                                    return <TileStation key={station.id} station={station} activeSelection={activeSelection} />;
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
