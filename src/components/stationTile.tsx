import { useState } from 'react';
import Station from '../interfaces/station';

interface StationTileProps {
    station: Station;
    updated: string;
    activeSelection: string;
}

export default function StationTile({ station, updated, activeSelection }: StationTileProps) {
    const [stationClicked, setStationClicked] = useState(false);

    function onStationClick() {
        if (stationClicked) {
            setStationClicked(false);
        } else {
            setStationClicked(true);
        }
    }

    return (
        <section className={`station-tile ${stationClicked ? 'station-large' : ''}`} onClick={onStationClick}>
            <div className={`station-status ${station.isOpen ? 'station-open' : 'station-closed'}`}></div>
            <div className="station-small-content">
                <div className="station-left">
                    <span className="station-brand">{station.brand}</span>
                    <div className="station-adress">
                        <div>
                            <span className="station-street">{station.street} </span>
                            <span className="station-housenumber">{station.houseNumber}</span>
                        </div>
                        <div>
                            <span className="station-postcode">{station.postCode} </span>
                            <span className="station-city">{station.place}</span>
                        </div>
                    </div>
                </div>

                <div className="station-right">
                    {activeSelection === 'e5' && <div>{station.e5 ? station.e5.toFixed(2).replace('.', ',') + ' €' : 'k. A.'}</div>}

                    {activeSelection === 'e10' && <div>{station.e10 ? station.e10.toFixed(2).replace('.', ',') + ' €' : 'k. A.'}</div>}

                    {activeSelection === 'diesel' && <div>{station.diesel ? station.diesel.toFixed(2).replace('.', ',') + ' €' : 'k. A.'}</div>}
                </div>
            </div>

            <div className={`station-large-content ${stationClicked ? 'station-large-visible' : ''}`}>
                <table>
                    <tbody>
                        <tr>
                            <td>Diesel:</td>
                            <td className="station-table-price">{station.diesel ? station.diesel.toFixed(2).replace('.', ',') + '€' : '-'}</td>
                        </tr>
                        <tr>
                            <td>E5:</td>
                            <td className="station-table-price">{station.e5 ? station.e5.toFixed(2).replace('.', ',') + '€' : '-'}</td>
                        </tr>
                        <tr>
                            <td>E10:</td>
                            <td className="station-table-price">{station.e10 ? station.e10.toFixed(2).replace('.', ',') + '€' : '-'}</td>
                        </tr>
                    </tbody>
                </table>
                <div className={`station-large-status ${station.isOpen ? 'station-large-open' : 'station-large-closed'}`}>
                    {station.isOpen ? 'Die Tankstelle hat geöffnet' : 'Die Tankstelle hat geschlossen'}
                </div>
                <div className="station-updated">Letztes Preisupdate: {updated}</div>
            </div>
        </section>
    );
}
