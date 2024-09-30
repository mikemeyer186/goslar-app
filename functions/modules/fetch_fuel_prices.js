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
            const apiUrl = `https://creativecommons.tankerkoenig.de/json/list.php?lat=51.92104&lng=10.43406&rad=3&sort=dist&type=all&apikey=${apiKey}`;
            const response = await axios.get(apiUrl, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const stations = response.data.stations;
            const timestamp = new Date();
            const currentDocRef = db.collection('fuel_prices').doc('current');
            const dataToStore = {
                updated: timestamp,
                data: stations,
            };

            await currentDocRef.set(dataToStore);
            console.log('Fuel prices fetched and stored successfully in "current" document.');
        } catch (error) {
            console.error('Error fetching fuel prices:', error);
        }
    });
