import { collection, doc, getDoc, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '../configs/firebase';
import type { LastPriceRecord } from '../interfaces/dailyAverage';

export async function loadCurrentFuelPrices() {
    const docRef = doc(db, 'fuel_prices', 'all');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        console.log('No such document!');
    }
}

export async function loadDailyAverages() {
    try {
        const dailyAverages = collection(db, 'fuel_prices', 'historic', 'daily_average');
        const dailyAveragesQuery = query(dailyAverages, orderBy('day', 'desc'), limit(50));
        const snapshot = await getDocs(dailyAveragesQuery);
        const data: object[] = [];

        if (!snapshot.empty) {
            snapshot.forEach((doc) => {
                const docData = doc.data();
                data.push(docData);
            });
        } else {
            console.log('No fuel prices found!');
        }

        return data;
    } catch (error) {
        console.error('Error while requesting fuel prices:', error);
        throw error;
    }
}

export async function loadLastPrices(): Promise<LastPriceRecord[]> {
    try {
        const lastPrices = collection(db, 'fuel_prices', 'historic', 'iso_timestamps');
        const lastQuery = query(lastPrices, orderBy('__name__', 'desc'), limit(336));
        const snapshot = await getDocs(lastQuery);
        const prices: LastPriceRecord[] = [];

        if (!snapshot.empty) {
            snapshot.forEach((doc) => {
                const docData = doc.data().data;

                prices.push({
                    date: doc.id,
                    data: Array.isArray(docData) ? docData : [],
                });
            });
        } else {
            console.log('No fuel prices found!');
        }

        return prices;
    } catch (error) {
        console.error('Error while requesting fuel prices:', error);
        throw error;
    }
}
