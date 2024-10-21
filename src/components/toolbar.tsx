import { useState } from 'react';
import Filter from './filter';
import Station from '../interfaces/station';

interface ToolbarProps {
    activeSelection: string;
    onFuelSelection: CallableFunction;
    onSliderMove: VoidFunction;
    showOnlyOpenStations: boolean;
    openStations: Station[];
    selectedCities: string[];
    setSelectedCities: CallableFunction;
    isFiltered: boolean;
}

export default function Toolbar({
    activeSelection,
    onFuelSelection,
    onSliderMove,
    showOnlyOpenStations,
    openStations,
    isFiltered,
    selectedCities,
    setSelectedCities,
}: ToolbarProps) {
    const [showFilter, setShowFilter] = useState(false);

    function toogleShowFilter() {
        if (showFilter) {
            setShowFilter(false);
            document.body.classList.remove('overflow-hidden');
        } else {
            setShowFilter(true);
            document.body.classList.add('overflow-hidden');
        }
    }

    return (
        <>
            <section className="toolbar">
                <div className="toolbar-slider">
                    <span className="toolbar-slider-label">Nur offene Tankstellen anzeigen?</span>
                    <div className={`toolbar-slider-toggle ${!showOnlyOpenStations ? 'slider-inactive' : ''}`} onClick={onSliderMove}>
                        <div className="toolbar-slider-knob"></div>
                    </div>
                </div>

                <div className="toolbar-filter">
                    <div>
                        <button
                            className={`btn-selection ${activeSelection === 'diesel' ? 'btn-active' : ''}`}
                            onClick={() => onFuelSelection('diesel')}
                        >
                            Diesel
                        </button>
                        <button className={`btn-selection ${activeSelection === 'e5' ? 'btn-active' : ''}`} onClick={() => onFuelSelection('e5')}>
                            E5
                        </button>
                        <button className={`btn-selection ${activeSelection === 'e10' ? 'btn-active' : ''}`} onClick={() => onFuelSelection('e10')}>
                            E10
                        </button>
                    </div>

                    <div>
                        <button className="btn-filter" onClick={toogleShowFilter}>
                            {isFiltered ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="36" height="36">
                                    <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="2" fill="#3f3f3e" />
                                    <line x1="25" y1="37" x2="75" y2="37" stroke="white" strokeWidth="5" strokeLinecap="round" />
                                    <line x1="33" y1="52" x2="67" y2="52" stroke="white" strokeWidth="5" strokeLinecap="round" />
                                    <line x1="40" y1="67" x2="60" y2="67" stroke="white" strokeWidth="5" strokeLinecap="round" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="36" height="36">
                                    <circle cx="50" cy="50" r="45" stroke="black" strokeWidth="2" fill="none" />
                                    <line x1="25" y1="37" x2="75" y2="37" stroke="black" strokeWidth="5" strokeLinecap="round" />
                                    <line x1="33" y1="52" x2="67" y2="52" stroke="black" strokeWidth="5" strokeLinecap="round" />
                                    <line x1="40" y1="67" x2="60" y2="67" stroke="black" strokeWidth="5" strokeLinecap="round" />
                                </svg>
                            )}
                        </button>

                        <div className={`filter-menu ${showFilter ? 'filter-menu-active' : ''}`}>
                            <Filter openStations={openStations} selectedCities={selectedCities} setSelectedCities={setSelectedCities} />
                        </div>
                    </div>
                </div>
            </section>

            <div className={`filter-backdrop ${showFilter ? 'filter-backdrop-active' : ''}`} onClick={toogleShowFilter}></div>
        </>
    );
}
