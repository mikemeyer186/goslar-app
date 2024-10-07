import { doc, getDoc } from 'firebase/firestore';
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
