const { onMessagePublished } = require('firebase-functions/v2/pubsub');
const axios = require('axios');
const admin = require('./firebase_admin');
const cities = require('./cities.json');

const db = admin.firestore();

exports.fetchFuelPrices = onMessagePublished(
    {
        region: 'europe-west3',
        topic: 'firebase-schedule-fetchFuelPrices-europe-west3',
    },
    async (message) => {
        try {
            const pubsubMessage = message.data.message;
            const decodedData = pubsubMessage.data
                ? JSON.parse(Buffer.from(pubsubMessage.data, 'base64').toString())
                : {};
            const action = decodedData.trigger;

            if (action !== 'scheduled_fetch') {
                console.log('Unexpected action:', action);
                return;
            }

            const apiKey = process.env.TANKER_API_KEY;
            const urlSection_1 = process.env.TANKER_API_URL_1;
            const urlRadius = process.env.TANKER_API_RADIUS;
            const urlSection_2 = process.env.TANKER_API_URL_2;
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
            const date = new Date();
            const isoTimestamp = date.toISOString();
            const localStringTimestamp = date.toLocaleString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Europe/Berlin',
            });
            let historicStations = [];

            // filtering the cheapest stations
            const cheapestDiesel = [...filteredStations].sort((a, b) => a.diesel - b.diesel).filter((station) => station.diesel != null && station.isOpen);
            const cheapestE5 = [...filteredStations].sort((a, b) => a.e5 - b.e5).filter((station) => station.e5 != null && station.isOpen);
            const cheapestE10 = [...filteredStations].sort((a, b) => a.e10 - b.e10).filter((station) => station.e10 != null && station.isOpen);

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
                if (station.diesel && station.street !== 'A' && station.isOpen) {
                    sum.diesel += station.diesel;
                    counter.diesel += 1;
                }
                if (station.e5 && station.street !== 'A' && station.isOpen) {
                    sum.e5 += station.e5;
                    counter.e5 += 1;
                }
                if (station.e10 && station.street !== 'A' && station.isOpen) {
                    sum.e10 += station.e10;
                    counter.e10 += 1;
                }
            });

            mediumValues = {
                diesel: sum.diesel / counter.diesel,
                e5: sum.e5 / counter.e5,
                e10: sum.e10 / counter.e10,
            };

            // calculate min/max values
            let minDiesel = Infinity,
                maxDiesel = -Infinity;
            let minE5 = Infinity,
                maxE5 = -Infinity;
            let minE10 = Infinity,
                maxE10 = -Infinity;

            filteredStations.forEach((station) => {
                if (station.diesel && station.street !== 'A' && station.isOpen) {
                    if (station.diesel < minDiesel) {
                        minDiesel = station.diesel;
                    }
                    if (station.diesel > maxDiesel) {
                        maxDiesel = station.diesel;
                    }
                }
                if (station.e5 && station.street !== 'A' && station.isOpen) {
                    if (station.e5 < minE5) {
                        minE5 = station.e5;
                    }
                    if (station.e5 > maxE5) {
                        maxE5 = station.e5;
                    }
                }
                if (station.e10 && station.street !== 'A' && station.isOpen) {
                    if (station.e10 < minE10) {
                        minE10 = station.e10;
                    }
                    if (station.e10 > maxE10) {
                        maxE10 = station.e10;
                    }
                }
            });

            const formatPrice = (price) => {
                return price
                    .toString()
                    .replace('.', ',')
                    .replace(/(\d+,\d{2})\d*/, '$1');
            };

            // widget 1
            const description1 = `E5: \t\t${formatPrice(minE5)}€ - ${formatPrice(maxE5)}€\nE10: \t${formatPrice(minE10)}€ - ${formatPrice(maxE10)}€\nDiesel: \t${formatPrice(minDiesel)}€ - ${formatPrice(maxDiesel)}€`;

            const widgetData1 = {
                title: 'Aktuelle Preisspanne',
                description: description1,
                image_url: 'https://tanken-in-goslar.de/assets/images/goslar-app_logo_2.png',
                call_to_action_url: 'https://tanken-in-goslar.de/',
                published_at: isoTimestamp,
            };

            // widget 2
            const description2 = `E5: \t\t${formatPrice(mediumValues.e5)}€\nE10: \t${formatPrice(mediumValues.e10)}€\nDiesel: \t${formatPrice(mediumValues.diesel)}€`;

            const widgetData2 = {
                title: 'Aktuelle Durchschnittspreise',
                description: description2,
                image_url: 'https://tanken-in-goslar.de/assets/images/goslar-app_logo_2.png',
                call_to_action_url: 'https://tanken-in-goslar.de/',
                published_at: isoTimestamp,
            };

            // widget 3
            const description3 = `E5: ${formatPrice(cheapestStations.e5.e5)}€ - ${cheapestStations.e5.brand}, ${cheapestStations.e5.place}\nE10: ${formatPrice(cheapestStations.e10.e10)}€ - ${cheapestStations.e10.brand}, ${cheapestStations.e10.place}\nDiesel: ${formatPrice(cheapestStations.diesel.diesel)}€ - ${cheapestStations.diesel.brand}, ${cheapestStations.diesel.place}`;

            const widgetData3 = {
                title: 'Günstigste Tankstellen',
                description: description3,
                image_url: '',
                call_to_action_url: 'https://tanken-in-goslar.de/',
                published_at: isoTimestamp,
            };

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
                updated: localStringTimestamp,
                data: filteredStations,
            });

            const cheapestDocRef = await db.collection('fuel_prices').doc('cheapest').set({
                updated: localStringTimestamp,
                data: cheapestStations,
            });

            const historicDocRefIso = db.collection('fuel_prices').doc('historic').collection('iso_timestamps');
            await historicDocRefIso.doc(isoTimestamp).set({ data: historicStations });

            const stationWrites = [];
            for (const station of filteredStations) {
                stationWrites.push(db.collection('fuel_prices').doc(station.id).set(station));
            }
            await Promise.all(stationWrites);

            await db.collection('fuel_prices').doc('widget1').set(widgetData1);
            await db.collection('fuel_prices').doc('widget2').set(widgetData2);
            await db.collection('fuel_prices').doc('widget3').set(widgetData3);

            console.log('Fuel prices fetched and stored successfully in Firestore.');
        } catch (error) {
            console.error('Error fetching fuel prices:', error);
        }
    });
