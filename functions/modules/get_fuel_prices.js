const functions = require('firebase-functions');
const admin = require('./firebase_admin');
const cors = require('cors')({ origin: true });

const db = admin.firestore();

exports.getFuelPrices = functions.region('europe-west3').https.onRequest((req, res) => {
    cors(req, res, async () => {
        try {
            if (req.method !== 'GET') {
                return res.status(405).json({ error: 'Method not allowed' });
            }

            const currentDocRef = db.collection('fuel_prices').doc('current');
            const doc = await currentDocRef.get();

            if (!doc.exists) {
                return res.status(404).json({ error: 'No current fuel prices found!' });
            }

            const data = doc.data();

            return res.status(200).json(data);
        } catch (error) {
            console.error('Error while fetching fuel prices:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    });
});
