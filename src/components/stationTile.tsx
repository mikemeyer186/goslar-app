import Station from '../interfaces/station';

interface StationTileProps {
    station: Station;
    updated: string;
}

export default function StationTile({ station, updated }: StationTileProps) {
    return (
        <section className="station-tile">
            <div>{station.brand}</div>
            <div>
                <span>{station.street} </span>
                <span>{station.houseNumber}</span>
            </div>
            <div>
                <span>{station.postCode} </span>
                <span>{station.place}</span>
            </div>
            <div>Diesel: {station.diesel ? station.diesel.toFixed(2) + '€' : '-'}</div>
            <div>E5: {station.e5 ? station.e5.toFixed(2) + '€' : '-'}</div>
            <div>E10: {station.e10 ? station.e10.toFixed(2) + '€' : '-'}</div>
            <div>Letzes Update: {updated}</div>
        </section>
    );
}
