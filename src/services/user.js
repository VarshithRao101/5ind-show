import { db } from "../config/firebase";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";

export const updateHistory = async (uid, movieId) => {
    if (!uid || !movieId) return;
    try {
        // Write to: history/{uid}/items/{movieId}
        await setDoc(doc(db, "history", uid, "items", String(movieId)), {
            movieId,
            watchedAt: Date.now()
        });
    } catch (e) {
        console.error("Error updating history:", e);
    }
};

export const getUserGenres = async (uid) => {
    if (!uid) return [];
    try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
            const data = userDoc.data();
            // Assuming preferences is a map field
            return data.preferences?.genres || [];
        }
    } catch (e) {
        console.error("Error fetching user genres:", e);
    }
    return [];
};

export const getUserHistory = async (uid) => {
    if (!uid) return [];
    try {
        const historyRef = collection(db, "history", uid, "items");
        const snapshot = await getDocs(historyRef);
        return snapshot.docs.map(doc => doc.data());
    } catch (e) {
        console.error("Error fetching user history:", e);
        return [];
    }
};
