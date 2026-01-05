const fetchCurrentPrices = require('./modules/fetch_fuel_prices');
exports.fetchFuelPrices = fetchCurrentPrices.fetchFuelPrices;

const calcDailyAverage = require('./modules/calc_daily_avg');
exports.calculateDailyAverage = calcDailyAverage.calculateDailyAverage;