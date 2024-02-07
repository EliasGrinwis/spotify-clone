import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCrGQ5BCKMotF6oS7G37Gd_InqfEHiSc7E",
  authDomain: "spotify-ab8ac.firebaseapp.com",
  projectId: "spotify-ab8ac",
  storageBucket: "spotify-ab8ac.appspot.com",
  messagingSenderId: "764020267121",
  appId: "1:764020267121:web:fdadc1228e9621d76ba3d0",
  measurementId: "G-EWJ4CQECRM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const auth = getAuth(app);
export default app;

export {storage, ref, uploadBytes, getDownloadURL};
