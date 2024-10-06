const functions = require('firebase-functions');
const axios = require('axios');
const admin = require('./firebase_admin');

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

            // fetching the data from API
            const response = await axios.get(apiUrl, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const stations = response.data.stations;
            const nearestStations = stations.slice().filter((station) => station.dist <= 3);
            const timestamp = new Date();

            // filtering the cheapest stations
            const cheapestDiesel = nearestStations.sort((a, b) => a.diesel - b.diesel).filter((station) => station.diesel != null);
            const cheapestE5 = nearestStations.sort((a, b) => a.e5 - b.e5).filter((station) => station.e5 != null);
            const cheapestE10 = nearestStations.sort((a, b) => a.e10 - b.e10).filter((station) => station.e10 != null);

            const cheapestStations = {
                diesel: cheapestDiesel[0],
                e5: cheapestE5[0],
                e10: cheapestE10[0],
            };

            // storing in Firestore
            const cheapestDocRef = await db.collection('fuel_prices').doc('cheapest').set({
                updated: timestamp,
                data: cheapestStations,
            });

            const allDocRef = await db.collection('fuel_prices').doc('all').set({
                updated: timestamp,
                data: stations,
            });

            console.log('Fuel prices fetched and stored successfully in Firestore.');
        } catch (error) {
            console.error('Error fetching fuel prices:', error);
        }
    });
