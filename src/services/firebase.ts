import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../configs/firebase';

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
        const snapshot = await getDocs(dailyAverages);
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
