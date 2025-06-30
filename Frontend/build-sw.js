import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read environment variables
const env = process.env;

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY ,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN ,
  projectId: env.VITE_FIREBASE_PROJECT_ID ,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET ,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID ,
  appId: env.VITE_FIREBASE_APP_ID ,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID
};

// Read the service worker template
const swTemplatePath = path.join(__dirname, 'public', 'firebase-messaging-sw.js');
const swTemplate = fs.readFileSync(swTemplatePath, 'utf8');

// Replace the config placeholder with actual config
const updatedSw = swTemplate.replace(
  /const firebaseConfig = \{[\s\S]*?\};/,
  `const firebaseConfig = ${JSON.stringify(firebaseConfig, null, 2)};`
);

// Write the updated service worker
fs.writeFileSync(swTemplatePath, updatedSw);

console.log('Service worker updated with environment variables');
console.log('Updated file:', swTemplatePath); 