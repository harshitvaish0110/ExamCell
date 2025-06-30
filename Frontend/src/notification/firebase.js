// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let messaging = null;

// Initialize messaging immediately
const initializeMessaging = async () => {
  try {
    console.log("Starting Firebase initialization...");
    const isMessagingSupported = await isSupported();
    console.log("Firebase messaging supported:", isMessagingSupported);
    
    if (isMessagingSupported) {
      messaging = getMessaging(app);
      console.log("Firebase Messaging initialized successfully");
      
      // Register service worker
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          console.log('Service Worker registered successfully:', registration);
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      }
    } else {
      console.warn("Firebase Messaging is not supported in this browser");
    }
  } catch (error) {
    console.error("Failed to initialize Firebase Messaging:", error);
  }
};

// Initialize messaging on module load
initializeMessaging();

export const generateToken = async (email) => {
    try {
        console.log(" Requesting notification permission...");
        
        // Wait a bit for Firebase to initialize
        let attempts = 0;
        while (!messaging && attempts < 30) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (!messaging) {
            console.error("Firebase Messaging not initialized");
            return null;
        }
        
        const permission = await Notification.requestPermission();
        console.log("Notification permission result:", permission);
        
        if (permission === "granted") {
            console.log("Generating Firebase token...");
            const token = await getToken(messaging, {
                vapidKey: import.meta.env.VITE_FIREBASE_KEY
            });
            
            console.log("Firebase token generated:", token ? "Success" : "Failed");
            
            if (token && email) {
                console.log(" Registering token with backend for email:", email);
                await registerTokenWithBackend(email, token);
            }
            
            return token;
        } else {
            console.log("Notification permission denied");
            return null;
        }
    } catch (error) {
        console.error("Error generating Firebase token:", error);
        return null;
    }
};

const registerTokenWithBackend = async (email, token) => {
    try {
        console.log("Sending token to backend...");
        const response = await fetch('http://localhost:8080/api/students/update-firebase-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                firebaseToken: token
            })
        });
        
        console.log(" Backend response status:", response.status);
        
        if (response.ok) {
            const result = await response.json();
            console.log("Firebase token registered successfully:", result);
        } else {
            const errorText = await response.text();
            console.error("Failed to register Firebase token. Status:", response.status, "Error:", errorText);
        }
    } catch (error) {
        console.error("Error registering Firebase token:", error);
    }
};

export const onMessageListener = () => {
    return new Promise((resolve) => {
        console.log("Setting up Firebase message listener...");
        
        // Wait for messaging to be available
        const checkMessaging = () => {
            if (messaging) {
                console.log("Messaging available, setting up listener...");
                
                onMessage(messaging, (payload) => {
                    console.log("Received Firebase message:", payload);
                    resolve(payload);
                });
                
                console.log("Firebase message listener setup completed");
            } else {
                console.log("Messaging not available yet, retrying...");
                setTimeout(checkMessaging, 100);
            }
        };
        
        checkMessaging();
    });
};

export { messaging };

