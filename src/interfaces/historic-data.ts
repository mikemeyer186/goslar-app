import HistoricPrices from './historic-prices';

interface HistoricData {
    [timestamp: string]: HistoricPrices[];
}

export default HistoricData;
