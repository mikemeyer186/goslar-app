import { useState } from 'react';
import Station from '../interfaces/station';
import PriceChart from './priceChart';

interface StationTileProps {
    station: Station;
    activeSelection: string;
}

export default function StationTile({ station, activeSelection }: StationTileProps) {
    const [stationClicked, setStationClicked] = useState(false);

    function onStationClick() {
        if (stationClicked) {
            setStationClicked(false);
        } else {
            setStationClicked(true);
        }
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
        <section className={`station-tile ${stationClicked ? 'station-large' : ''}`} onClick={onStationClick}>
            <div className="station-small-content">
                <div className="station-left">
                    <span className="station-brand">{station.brand}</span>
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

                <div className="station-right">
                    {activeSelection === 'e5' && <div>{station.e5 ? truncatePrice(station.e5) : 'k. A.'}</div>}

                    {activeSelection === 'e10' && <div>{station.e10 ? truncatePrice(station.e10) : 'k. A.'}</div>}

                    {activeSelection === 'diesel' && <div>{station.diesel ? truncatePrice(station.diesel) : 'k. A.'}</div>}
                </div>
            </div>

            <div className={`station-large-content ${stationClicked ? 'station-large-visible' : ''}`}>
                <div className={`station-large-status ${station.isOpen ? 'station-large-open' : 'station-large-closed'}`}>
                    {station.isOpen ? 'Die Tankstelle hat geöffnet' : 'Die Tankstelle hat zur Zeit geschlossen'}
                </div>

                <div className="station-table-chart">
                    <table className="station-table">
                        <tbody>
                            <tr>
                                <td>Diesel:</td>
                                <td className="station-table-price">{station.diesel ? truncatePrice(station.diesel) : '-'}</td>
                            </tr>
                            <tr>
                                <td>E5:</td>
                                <td className="station-table-price">{station.e5 ? truncatePrice(station.e5) : '-'}</td>
                            </tr>
                            <tr>
                                <td>E10:</td>
                                <td className="station-table-price">{station.e10 ? truncatePrice(station.e10) : '-'}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="station-chart">
                        <PriceChart />
                    </div>
                </div>
            </div>
        </section>
    );
}
