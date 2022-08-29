import {initializeApp} from 'firebase/app';
import {getStorage} from 'firebase/storage'

// firebase configiration
const firebaseConfig = {
    apiKey: "AIzaSyBRHyLleB7i6LDXHDwQkqgSE_l0_aWehE8",
    authDomain: "sampay-345418.firebaseapp.com",
    projectId: "sampay-345418",
    storageBucket: "sampay-345418.appspot.com",
    messagingSenderId: "677983839287",
    appId: "1:677983839287:web:5ddbf25b6bd5a3a8e5cbb2"
  };

  const firebaseApp = initializeApp(firebaseConfig);

  export default getStorage(firebaseApp)