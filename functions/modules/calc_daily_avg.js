const { onMessagePublished } = require('firebase-functions/v2/pubsub');
const admin = require('./firebase_admin');
const { FieldPath } = require('firebase-admin/firestore');

const db = admin.firestore();

/**
 * Convert ISO string timestamp (doc id) to YYYY-MM-DD in Europe/Berlin.
 * Example: "2025-02-16T17:44:27.921Z" -> "2025-02-16"
 */
function toBerlinDayKey(isoTimestampString) {
    const d = new Date(isoTimestampString);
    if (Number.isNaN(d.getTime())) {
        throw new Error(`Invalid ISO timestamp doc id: "${isoTimestampString}"`);
    }

    const parts = new Intl.DateTimeFormat('de-DE', {
        timeZone: 'Europe/Berlin',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(d);

    const y = parts.find((p) => p.type === 'year')?.value;
    const m = parts.find((p) => p.type === 'month')?.value;
    const day = parts.find((p) => p.type === 'day')?.value;

    return `${y}-${m}-${day}`;
}

function isFiniteNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
}

/**
 * Trigger: Pub/Sub scheduled topic
 * - Reads last 48 docs from fuel_prices/historic/iso_timestamps
 * - Writes daily averages to fuel_prices/historic/daily_average/{YYYY-MM-DD}
 * - Counts ONLY open stations (isOpen === true)
 */
exports.calculateDailyAverage = onMessagePublished(
    {
        region: 'europe-west3',
        // Topic-Name kannst du frei wählen, aber analog zu fetchFuelPrices ist das hier konsistent:
        topic: 'firebase-schedule-calculateDailyAverage-europe-west3',
    },
    async (message) => {
        try {
            // Optional: gleicher Guard wie bei dir (nur auf scheduled_fetch reagieren)
            const pubsubMessage = message.data.message;
            const decodedData = pubsubMessage?.data
                ? JSON.parse(Buffer.from(pubsubMessage.data, 'base64').toString())
                : {};
            const action = decodedData.trigger;

            if (action && action !== 'scheduled_calculation') {
                console.log('Unexpected action:', action);
                return;
            }

            // 1) Read last 48 snapshots (Doc-ID ist ISO Timestamp => lexikografisch sortierbar)
            const isoColRef = db.collection('fuel_prices').doc('historic').collection('iso_timestamps');
            const snap = await isoColRef.orderBy(FieldPath.documentId(), 'desc').limit(48).get();

            if (snap.empty) {
                console.log('No documents found in fuel_prices/historic/iso_timestamps.');
                return;
            }

            // byDay[dayKey].byStation[stationId] = { sums: {diesel,e5,e10}, counts: {diesel,e5,e10} }
            const byDay = Object.create(null);

            for (const doc of snap.docs) {
                const isoId = doc.id;

                let dayKey;
                try {
                    dayKey = toBerlinDayKey(isoId);
                } catch (e) {
                    console.warn(String(e));
                    continue;
                }

                const payload = doc.data() || {};
                const stations = Array.isArray(payload.data) ? payload.data : [];

                if (!byDay[dayKey]) {
                    byDay[dayKey] = { byStation: Object.create(null) };
                }

                for (const s of stations) {
                    const stationId = s?.id;
                    if (!stationId) continue;

                    // ✅ Nur offene Stationen berücksichtigen
                    if (s.isOpen !== true) continue;

                    const stationAgg =
                        byDay[dayKey].byStation[stationId] ||
                        (byDay[dayKey].byStation[stationId] = {
                            sums: { diesel: 0, e5: 0, e10: 0 },
                            counts: { diesel: 0, e5: 0, e10: 0 },
                        });

                    // Nur valide Zahlen zählen (null/undefined/NaN ignorieren)
                    if (isFiniteNumber(s.diesel)) {
                        stationAgg.sums.diesel += s.diesel;
                        stationAgg.counts.diesel += 1;
                    }
                    if (isFiniteNumber(s.e5)) {
                        stationAgg.sums.e5 += s.e5;
                        stationAgg.counts.e5 += 1;
                    }
                    if (isFiniteNumber(s.e10)) {
                        stationAgg.sums.e10 += s.e10;
                        stationAgg.counts.e10 += 1;
                    }
                }
            }

            const dayKeys = Object.keys(byDay);
            if (dayKeys.length === 0) {
                console.log('No valid snapshots aggregated (maybe invalid ids).');
                return;
            }

            // 2) Write one doc per dayKey into daily_average/{YYYY-MM-DD}
            const nowIso = new Date().toISOString();
            const writes = [];

            for (const dayKey of dayKeys) {
                const stationsMap = Object.create(null);

                for (const [stationId, agg] of Object.entries(byDay[dayKey].byStation)) {
                    const avg = {
                        diesel: agg.counts.diesel ? agg.sums.diesel / agg.counts.diesel : null,
                        e5: agg.counts.e5 ? agg.sums.e5 / agg.counts.e5 : null,
                        e10: agg.counts.e10 ? agg.sums.e10 / agg.counts.e10 : null,
                    };

                    stationsMap[stationId] = {
                        station_id: stationId,
                        average: avg,
                        counts: { ...agg.counts },
                    };
                }

                const docData = {
                    day: dayKey,
                    updated_at: nowIso,
                    source: {
                        input_collection: 'fuel_prices/historic/iso_timestamps',
                        output_collection: 'fuel_prices/historic/daily_average',
                        snapshots_used: 48,
                        open_only: true,
                        day_key_timezone: 'Europe/Berlin',
                    },
                    stations: stationsMap,
                };

                writes.push(db.collection('fuel_prices').doc('historic').collection('daily_average').doc(dayKey).set(docData, { merge: true }));
            }

            await Promise.all(writes);

            console.log(`Daily averages written for ${writes.length} day(s) into fuel_prices/historic/daily_average.`);
        } catch (error) {
            console.error('Error calculating daily averages:', error);
        }
    }
);