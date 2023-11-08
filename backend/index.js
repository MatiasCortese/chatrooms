"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var db_1 = require("./db");
var cors = require("cors");
var nanoid_1 = require("nanoid");
var process = require("process");
var app = express();
var port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
var roomCollection = db_1.firestore.collection("rooms");
var userCollection = db_1.firestore.collection("users");
app.get("/hola", function (req, res) {
    res.json({
        message: "hola desde el server"
    });
});
// endpoint para crear un room y que nos devuelva su ID, 
app.post("/rooms", function (req, res) {
    var userId = req.body.userId;
    var email = req.body.email;
    var name = req.body.name;
    var messages = req.body.messages;
    var roomRef = db_1.rtdb.ref("rooms/" + (0, nanoid_1.nanoid)());
    roomRef
        .set({
        owner: email,
        name: name,
        messages: messages,
    })
        .then(function () {
        var longRoomId = roomRef.key;
        var roomId = 1000 + Math.floor(Math.random() * 999);
        roomCollection
            .doc(roomId.toString())
            .set({
            rtdbRoomId: longRoomId,
        })
            .then(function () {
            res.json({
                id: roomId.toString()
            });
        });
    });
});
// endpoint para crear un room y que nos devuelva su ID. esta API nos sirve para ver como funciona el ejemplo de Marce. Si queremos hacer funcionar nuestro chat, debemos activar la otra API que hace post a /rooms
app.post("/rooms", function (req, res) {
    var userId = req.body.userId;
    // pasamos el id a string, hacemos el get y si el usuario existe, podemos crear un room
    userCollection
        .doc(userId.toString())
        .get()
        .then(function (doc) {
        if (doc.exists) {
            //  creamos un room en rtdb
            var roomRef_1 = db_1.rtdb
                .ref("rooms/" + (0, nanoid_1.nanoid)());
            roomRef_1
                .set({
                messages: [],
                owner: userId,
            })
                .then(function () {
                var longRoomId = roomRef_1.key;
                var roomId = 1000 + Math.floor(Math.random() * 999);
                roomCollection
                    .doc(roomId.toString())
                    .set({
                    rtdbRoomId: longRoomId,
                })
                    .then(function () {
                    res.json({
                        id: roomId.toString()
                    });
                });
            });
        }
        else {
            res.status(401).json({
                message: "no existis"
            });
        }
    });
});
// endpoint para ingresar a un room
app.get("/rooms/:roomId", function (req, res) {
    var roomId = req.params.roomId;
    roomCollection
        .doc(roomId.toString())
        .get()
        .then(function (snap) {
        var data = snap.data();
        res.json(data);
    });
});
// endpoint para enviar mensajes a un room
// ver bien la vuelta del ID de rtdb y de firestore
app.post("/rooms/:roomId/messages", function (req, res) {
    var roomId = req.params.roomId;
    var message = req.body.message;
    var longRoomId;
    roomCollection
        .doc(roomId.toString())
        .get()
        .then(function (snap) {
        // Aca ya tenemos el longRoomId, ahora faltaria tirarle los mensajes (ver si el user va adentro de cada mensaje) a rtdb
        var data = snap.data();
        longRoomId = data.rtdbRoomId;
        var roomRef = db_1.rtdb.ref("rooms/" + longRoomId + "/messages");
        roomRef.push(message);
        res.json(roomRef);
    });
});
// login
app.post("/auth", function (req, res) {
    var email = req.body.email;
    userCollection
        .where("email", "==", email)
        .get()
        .then(function (searchResponse) {
        if (searchResponse.empty) {
            res.status(404).json({
                message: "user not found"
            });
        }
        else {
            res.json({
                // este id es fundamental
                id: searchResponse.docs[0].id
            });
        }
    });
});
app.use(express.static("dist"));
app.get("*", function (req, res) {
    res.sendFile("./" + __dirname + "/dist/index.html");
});
app.listen(port, function () { return console.log("conectado al puerto ", port); });
