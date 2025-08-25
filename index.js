import express from "express";
import admin from "firebase-admin";
import cors from "cors";

// Import service account key
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(cors());
app.use(express.json());

// Send notification route
app.post("/send", async (req, res) => {
    const { token, title, body } = req.body;
    try {
        const message = {
            notification: { title, body },
            token,
        };
        const response = await admin.messaging().send(message);
        res.send({ success: true, response });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).send({ success: false, error: error.message });
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server started on http://localhost:${PORT}`);
});
