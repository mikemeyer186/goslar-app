const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

admin.initializeApp();

const db = admin.firestore();

const app = express();
const port = process.env.PORT || 8080;

const allowedOrigins = ['http://localhost:4200', 'https://goslar-app.mike-meyer.dev'];

// CORS options
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'CORS policy: Origin ' + origin + ' is not allowed.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
};

app.use(cors(corsOptions));

app.use(express.json());

// API key authentication
const authenticateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({ error: 'API-Key is missing.' });
    }

    if (apiKey !== process.env.API_KEY) {
        return res.status(403).json({ error: 'Unknown API-Key.' });
    }

    next();
};

app.use(authenticateApiKey);

// Endpoint: /
app.get('/', async (req, res) => {
    try {
        const data = 'Please request "/cheapest", "/current" or "/historic" to get fuel prices.';
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error while requesting fuel prices:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Endpoint: /current
app.get('/current', async (req, res) => {
    try {
        const currentDocRef = db.collection('fuel_prices').doc('current');
        const doc = await currentDocRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'No current fuel prices found!' });
        }

        const data = doc.data();
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error while requesting current fuel prices:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Endpoint: /cheapest
app.get('/cheapest', async (req, res) => {
    try {
        const snapshot = await db.collection('fuel_prices').orderBy('price').limit(1).get();
        if (snapshot.empty) {
            return res.status(404).json({ error: 'Keine Spritpreise gefunden.' });
        }
        const data = [];
        snapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });
        res.status(200).json(data[0]);
    } catch (error) {
        console.error('Fehler beim Abrufen der günstigsten Spritpreise:', error);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});

// Endpoint: /historic
app.get('/historic', async (req, res) => {
    try {
        const snapshot = await db.collection('fuel_prices_historic').get();
        const data = [];
        snapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });
        res.status(200).json(data);
    } catch (error) {
        console.error('Fehler beim Abrufen der historischen Spritpreise:', error);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});

app.options('*', cors(corsOptions));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
