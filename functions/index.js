const fetchCurrentPrices = require('./modules/fetch_fuel_prices');
exports.fetchFuelPrices = fetchCurrentPrices.fetchFuelPrices;

const getCurrentPrices = require('./modules/get_fuel_prices');
exports.getFuelPrices = getCurrentPrices.getFuelPrices;
