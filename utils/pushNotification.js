import admin from "firebase-admin";
import firebaseApp from "../config/firebase.js";

const sendPushNotification = async (fcm_token, title, message) => {
    try {
        if (!admin.apps.length || !firebaseApp) {
            console.warn("⚠️ Firebase app not initialized. Skipping push notification.");
            return null;
        }

        const payload = {
            token: fcm_token,
            notification: {
                title,
                body: message,
            },
        };

        const response = await admin.messaging().send(payload);

        return response;

    } catch (error) {
        console.error("FCM Error:", error);
        throw error;
    }
};

export default sendPushNotification;