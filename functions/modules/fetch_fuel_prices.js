const functions = require('firebase-functions');
const axios = require('axios');
const admin = require('./firebase_admin');
const cities = require('./cities.json');

const db = admin.firestore();

exports.fetchFuelPrices = functions
    .region('europe-west3')
    .pubsub.topic('firebase-schedule-fetchFuelPrices-europe-west3')
    .onPublish(async (message) => {
        try {
            const data = message.json || {};
            const action = data.trigger;

            if (action !== 'scheduled_fetch') {
                console.log('Unexpected action:', action);
                return;
            }

            const apiKey = functions.config().tanker.api_key;
            const urlSection_1 = functions.config().tanker.api_url_1;
            const urlRadius = functions.config().tanker.api_radius;
            const urlSection_2 = functions.config().tanker.api_url_2;
            const apiUrl = urlSection_1 + urlRadius + urlSection_2 + apiKey;
            const postalCodes = cities.flatMap((city) => city.codes);

            // fetching the data from API
            const response = await axios.get(apiUrl, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const stations = response.data.stations;
            const filteredStations = stations.filter((station) => postalCodes.includes(station.postCode.toString()));
            const timestamp = new Date().toLocaleString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Europe/Berlin',
            });
            let historicStations = [];

            // filtering the cheapest stations
            const cheapestDiesel = filteredStations.sort((a, b) => a.diesel - b.diesel).filter((station) => station.diesel != null);
            const cheapestE5 = filteredStations.sort((a, b) => a.e5 - b.e5).filter((station) => station.e5 != null);
            const cheapestE10 = filteredStations.sort((a, b) => a.e10 - b.e10).filter((station) => station.e10 != null);

            const cheapestStations = {
                diesel: cheapestDiesel[0],
                e5: cheapestE5[0],
                e10: cheapestE10[0],
            };

            // calculate medium values
            let mediumValues = {
                diesel: 0,
                e5: 0,
                e10: 0,
            };

            let counter = {
                diesel: 0,
                e5: 0,
                e10: 0,
            };

            let sum = {
                diesel: 0,
                e5: 0,
                e10: 0,
            };

            filteredStations.forEach((station) => {
                if (station.diesel && station.street !== 'A') {
                    sum.diesel += station.diesel;
                    counter.diesel += 1;
                }
                if (station.e5 && station.street !== 'A') {
                    sum.e5 += station.e5;
                    counter.e5 += 1;
                }
                if (station.e10 && station.street !== 'A') {
                    sum.e10 += station.e10;
                    counter.e10 += 1;
                }
            });

            mediumValues = {
                diesel: sum.diesel / counter.diesel,
                e5: sum.e5 / counter.e5,
                e10: sum.e10 / counter.e10,
            };

            console.log(mediumValues, counter, sum);

            // creating historic station object
            filteredStations.forEach((station) => {
                const stationObject = {
                    id: station.id,
                    diesel: station.diesel,
                    e5: station.e5,
                    e10: station.e10,
                    isOpen: station.isOpen,
                };
                historicStations = [...historicStations, stationObject];
            });

            // storing in Firestore
            const allDocRef = await db.collection('fuel_prices').doc('all').set({
                updated: timestamp,
                data: filteredStations,
            });

            const cheapestDocRef = await db.collection('fuel_prices').doc('cheapest').set({
                updated: timestamp,
                data: cheapestStations,
            });

            const historicDocRef = db.collection('fuel_prices').doc('historic').collection('timestamps');
            await historicDocRef.doc(timestamp).set({ data: historicStations });

            filteredStations.forEach(async (station) => {
                const stationDocRef = await db.collection('fuel_prices').doc(station.id).set(station);
            });

            console.log('Fuel prices fetched and stored successfully in Firestore.');
        } catch (error) {
            console.error('Error fetching fuel prices:', error);
        }
    });
