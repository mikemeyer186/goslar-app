import { useState } from 'react';
import Station from '../interfaces/station';
import HistoricPrices from '../interfaces/historic-prices';

interface StationTileProps {
    station: Station;
    activeSelection: string;
    prices1Day: HistoricPrices | undefined;
    prices7Days: HistoricPrices | undefined;
}

export default function StationTile({ station, activeSelection, prices1Day, prices7Days }: StationTileProps) {
    const [stationClicked, setStationClicked] = useState(false);

    function onStationClick() {
        if (stationClicked) {
            setStationClicked(false);
        } else {
            setStationClicked(true);
        }
    }

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

                <table className="station-table">
                    <tbody>
                        <tr>
                            <td>Diesel:</td>
                            <td className="station-table-price">{station.diesel ? truncatePrice(station.diesel) : '-'}</td>
                            <td className="station-table-price">{prices1Day?.diesel ? truncatePrice(prices1Day.diesel - station.diesel) : '-'}</td>
                            <td className="station-table-price">{prices7Days?.diesel ? truncatePrice(prices7Days.diesel - station.diesel) : '-'}</td>
                        </tr>
                        <tr>
                            <td>E5:</td>
                            <td className="station-table-price">{station.e5 ? truncatePrice(station.e5) : '-'}</td>
                            <td className="station-table-price">{prices1Day?.e5 ? truncatePrice(prices1Day.e5 - station.e5) : '-'}</td>
                            <td className="station-table-price">{prices7Days?.e5 ? truncatePrice(prices7Days.e5 - station.e5) : '-'}</td>
                        </tr>
                        <tr>
                            <td>E10:</td>
                            <td className="station-table-price">{station.e10 ? truncatePrice(station.e10) : '-'}</td>
                            <td className="station-table-price">{prices1Day?.e10 ? truncatePrice(prices1Day.e10 - station.e10) : '-'}</td>
                            <td className="station-table-price">{prices7Days?.e10 ? truncatePrice(prices7Days.e10 - station.e10) : '-'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    );
}
