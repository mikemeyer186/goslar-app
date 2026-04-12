import { useState } from 'react';
import PriceChart from './priceChart';
import Station from '../interfaces/station';
import { FuelSelection, StationLatestPricePoint, StationPriceHistoryPoint } from '../interfaces/dailyAverage';

interface StationTileProps {
    station: Station;
    activeSelection: FuelSelection;
    priceHistory: StationPriceHistoryPoint[];
    latestPriceHistory: StationLatestPricePoint[];
}

interface PriceCardConfig {
    key: FuelSelection;
    label: string;
    value: number;
}

export default function StationTile({ station, activeSelection, priceHistory, latestPriceHistory }: StationTileProps) {
    const [stationClicked, setStationClicked] = useState(false);
    const selectedPrice = station[activeSelection];
    const priceCards: PriceCardConfig[] = [
        { key: 'diesel', label: 'Diesel', value: station.diesel },
        { key: 'e5', label: 'E5', value: station.e5 },
        { key: 'e10', label: 'E10', value: station.e10 },
    ];

    /**
     * Toggles the station tile between its collapsed and expanded state when clicked,
     * allowing the user to view more details and the price chart.
     */
    function onStationClick() {
        setStationClicked((currentState) => !currentState);
    }

    /**
     * Prevents the click event from propagating to the station tile when clicking on the chart,
     * so that the station tile doesn't collapse when interacting with the chart.
     * @param event - Click or tap event on the chart area
     */
    function onChartClick(event: React.MouseEvent<HTMLDivElement>) {
        event.stopPropagation();
    }

    /**
     * converts the price to a local formatted price without the third decimal number
     * @param price - price as number
     * @returns - local formatted price as string
     */
    function truncatePrice(price: number) {
        return (
            price
                .toString()
                .replace('.', ',')
                .replace(/(\d+,\d{2})\d*/, '$1') + ' €'
        );
    }

    return (
        <section className={`station-tile ${stationClicked ? 'station-large' : ''}`} onClick={onStationClick} aria-expanded={stationClicked}>
            <div className="station-small-content">
                <div className="station-left">
                    <span className="station-brand">{station.brand || station.name}</span>
                    <div className="station-adress">
                        <div>
                            <span className="station-street">{station.street.toLowerCase()} </span>
                            <span className="station-housenumber">{station.houseNumber}</span>
                        </div>
                        <div>
                            <span className="station-postcode">{station.postCode} </span>
                            <span className="station-city">{station.place.toLowerCase()}</span>
                        </div>
                    </div>
                </div>

                <div className={`station-right ${stationClicked ? 'station-right-hidden' : ''}`} aria-hidden={stationClicked}>
                    {selectedPrice ? truncatePrice(selectedPrice) : 'k. A.'}
                </div>
            </div>

            <div className={`station-large-content ${stationClicked ? 'station-large-visible' : ''}`}>
                <div className="station-large-header">
                    <div className={`station-large-status ${station.isOpen ? 'station-large-open' : 'station-large-closed'}`}>
                        {station.isOpen ? 'Die Tankstelle hat geöffnet' : 'Die Tankstelle ist zur Zeit geschlossen'}
                    </div>
                </div>

                <div className="station-price-overview">
                    {priceCards.map((priceCard) => (
                        <div
                            key={priceCard.key}
                            className={`station-price-card fuel-type-${priceCard.key} ${activeSelection === priceCard.key ? 'station-price-card-active' : ''}`}
                        >
                            <span className={`station-price-label fuel-type-label fuel-type-label-${priceCard.key}`}>{priceCard.label}</span>
                            <span className="station-price-value">{priceCard.value ? truncatePrice(priceCard.value) : '-'}</span>
                        </div>
                    ))}
                </div>

                <div className="station-chart" onClick={onChartClick}>
                    <PriceChart averageData={priceHistory} latestPriceData={latestPriceHistory} />
                </div>
            </div>
        </section>
    );
}
