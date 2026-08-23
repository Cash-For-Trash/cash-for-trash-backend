import admin from "firebase-admin";
import "../config/firebase.js";

const sendPushNotification = async (fcm_token, title, message) => {
    try {
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