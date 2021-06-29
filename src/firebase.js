import firebase from "firebase/app";
import 'firebase/database';

const firebaseConfig = {
   apiKey: "AIzaSyDx9r6icWCB88RC863_1hD3K6Re99ezoSs",
   authDomain: "concert-accountant-38173.firebaseapp.com",
   projectId: "concert-accountant-38173",
   storageBucket: "concert-accountant-38173.appspot.com",
   messagingSenderId: "179982856095",
   appId: "1:179982856095:web:132160d41a16951813d7aa",
   measurementId: "G-7RS5SYH149"
}

firebase.initializeApp(firebaseConfig);
// firebase.analytics();

export default firebase;