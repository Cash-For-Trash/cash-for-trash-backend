import admin from "firebase-admin";

let firebaseApp;

try {
    if (!admin.apps.length) {
        let privateKey = process.env.FIREBASE_PRIVATE_KEY;
        if (privateKey) {
            privateKey = privateKey.trim();
            if (
                (privateKey.startsWith('"') && privateKey.endsWith('"')) ||
                (privateKey.startsWith("'") && privateKey.endsWith("'"))
            ) {
                privateKey = privateKey.slice(1, -1);
            }
            privateKey = privateKey.replace(/\\n/g, "\n");
        }

        if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && privateKey) {
            firebaseApp = admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: privateKey,
                }),
            });
            console.log("✅ Firebase initialized successfully");
        } else {
            console.warn("⚠️ Firebase credentials missing or incomplete in environment variables.");
        }
    } else {
        firebaseApp = admin.app();
    }
} catch (error) {
    console.error("❌ Firebase Initialization Error:", error.message);
}

export default firebaseApp;