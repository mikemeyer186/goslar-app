const functions = require('firebase-functions');
const axios = require('axios');
const admin = require('./firebase_admin');

const db = admin.firestore();

exports.fetchFuelPrices = functions.region('europe-west3').https.onRequest(async (req, res) => {
    try {
        const apiKey = functions.config().tanker.api_key;
        const apiUrl = `https://creativecommons.tankerkoenig.de/json/list.php?lat=51.92104&lng=10.43406&rad=3&sort=dist&type=all&apikey=${apiKey}`;
        const response = await axios.get(apiUrl, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const stations = response.data.stations;
        const timestamp = admin.firestore.FieldValue.serverTimestamp();
        const currentDocRef = db.collection('fuel_prices').doc('current');
        const dataToStore = {
            updated: timestamp,
            data: stations,
        };

        await currentDocRef.set(dataToStore);
        console.log('Fuel prices fetched and stored successfully in "current" document.');
        res.status(200).send('Fuel prices fetched and stored successfully.');
    } catch (error) {
        console.error('Error fetching fuel prices:', error);
        res.status(500).send('Error fetching fuel prices.');
    }
});
