import { useMemo } from 'react';
import Station from '../interfaces/station';

interface FilterProps {
    openStations: Station[];
    setSelectedCities: CallableFunction;
    selectedCities: string[];
}

export default function Filter({ openStations, setSelectedCities, selectedCities }: FilterProps) {
    const uniqueCities = useMemo(() => {
        return [...new Set(openStations.map((station) => station.place))].sort((a, b) => a.localeCompare(b));
    }, [openStations]);

    function handelFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { value, checked } = event.target;

        setSelectedCities((prevSelected: string[]) => {
            if (checked) {
                return [...prevSelected, value];
            } else {
                return prevSelected.filter((city) => city !== value);
            }
        });
    }

    return (
        <section>
            {uniqueCities.map((city: string, index: number) => {
                return (
                    <div className="filter-menu-list" key={index}>
                        <input
                            type="checkbox"
                            id={`input ${index}`}
                            value={city}
                            checked={selectedCities.includes(city)}
                            onChange={handelFilterChange}
                        ></input>
                        <label className="filter-label" htmlFor={`input ${index}`}>
                            {city.toLowerCase()}
                        </label>
                    </div>
                );
            })}
        </section>
    );
}
