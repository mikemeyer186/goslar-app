import { useState } from 'react';
import './App.css';
import Station from './interfaces/station';

function App() {
    const [output, setOutput] = useState<Station[]>([]);

    async function requestPrices() {
        console.log('API request');
    }

    return (
        <>
            <button onClick={requestPrices}>Request Fuel Prices</button>

            <div className="stations-container">
                {output.map((station) => {
                    return (
                        <div className="station" key={station.id}>
                            <div>
                                <strong>{station.brand}</strong>
                            </div>
                            <div>
                                {station.street} {station.houseNumber}
                            </div>
                            <div>{station.place}</div>
                            <div>Diesel: {station.diesel}</div>
                            <div>E5: {station.e5}</div>
                            <div>E10: {station.e10}</div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default App;
