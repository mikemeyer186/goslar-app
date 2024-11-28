import { collection, doc, getDoc, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '../configs/firebase';
import HistoricPrices from '../interfaces/historic-prices';
import HistoricData from '../interfaces/historic-data';

export async function loadCurrentFuelPrices() {
    const docRef = doc(db, 'fuel_prices', 'all');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        console.log('No such document!');
    }
}

export async function loadHistoricFuelPrices() {
    try {
        const timestamps = collection(db, 'fuel_prices', 'historic', 'timestamps');
        const q = query(timestamps, orderBy('__name__', 'desc'), limit(200));
        const snapshot = await getDocs(q);
        const data: HistoricData = {};

        if (!snapshot.empty) {
            snapshot.forEach((doc) => {
                const docData = doc.data();
                data[doc.id] = docData.data as HistoricPrices[];
            });
        } else {
            console.log('No fuel prices found!');
        }
        console.log(Object.keys(data).length);

        return data;
    } catch (error) {
        console.error('Error while requesting fuel prices:', error);
        throw error;
    }
}
