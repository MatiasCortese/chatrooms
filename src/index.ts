import firebase from "firebase";
import {router} from "./router";
import { state } from "./state";
import "./components/chat-box";
import "./components/button";
import "./components/header";

const app = firebase.initializeApp({
    apiKey: "AIzaSyCveRBJconqfI1NaPXrQYju4RqGK8U1pqc",
    authDomain: "apx-dwf-m6-e4d74.firebaseapp.com",
    databaseURL: "https://apx-dwf-m6-e4d74-default-rtdb.firebaseio.com",
    projectId: "apx-dwf-m6-e4d74"
});


(function(){
    router;
})();