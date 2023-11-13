"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rtdb = exports.firestore = void 0;
var admin = require("firebase-admin");
var dotenv = require("dotenv");
var serviceAccount = require("./key.json");
dotenv.config();
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL,
});
var firestore = admin.firestore();
exports.firestore = firestore;
var rtdb = admin.database();
exports.rtdb = rtdb;
