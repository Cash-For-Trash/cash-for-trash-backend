import admin from "firebase-admin";
import firebaseApp from "../config/firebase.js";

const sendPushNotification = async (fcm_token, title, message) => {
    try {
        if (!admin.apps.length || !firebaseApp) {
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
        const errorCode = error?.code || error?.errorInfo?.code;
        const isInvalidToken =
            errorCode === "messaging/registration-token-not-registered" ||
            errorCode === "messaging/invalid-registration-token";

        if (!isInvalidToken) {
            console.error("FCM Error:", error);
        }
        throw error;
    }
};

export default sendPushNotification;