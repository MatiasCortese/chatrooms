import * as express from "express";
import * as dotenv from "dotenv";
import { firestore, rtdb } from "./db";
import * as cors from "cors";
import { nanoid } from "nanoid";
import * as process from "process";

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());

const roomCollection = firestore.collection("rooms");
const userCollection = firestore.collection("users");

app.get("/hola", (req, res) => {
    res.json({
        message: "hola desde el server"
    })
})

// endpoint para crear un room y que nos devuelva su ID, 
app.post("/rooms", (req, res) => {
    const { userId } = req.body;
    const { email } = req.body;
    const { name } = req.body;
    const { messages } = req.body;
    const roomRef = rtdb.ref("rooms/" + nanoid());
    roomRef
    .set({
        owner: email,
        name: name,
        messages: messages,
    })
    .then(() => {
        const longRoomId = roomRef.key;
        const roomId = 1000 + Math.floor(Math.random() * 999);
        roomCollection
            .doc(roomId.toString())
            .set({
                rtdbRoomId: longRoomId,
            })
            .then(() => {
                res.json({
                    id: roomId.toString()
                })
            })
    })
});

// endpoint para crear un room y que nos devuelva su ID. esta API nos sirve para ver como funciona el ejemplo de Marce. Si queremos hacer funcionar nuestro chat, debemos activar la otra API que hace post a /rooms
app.post("/rooms", (req, res) => {
    const { userId } = req.body;
    // pasamos el id a string, hacemos el get y si el usuario existe, podemos crear un room
    userCollection
    .doc(userId.toString())
    .get()
    .then(doc => {
        if (doc.exists){
            //  creamos un room en rtdb
            const roomRef = rtdb
            .ref("rooms/" + nanoid());
            roomRef
            .set({
                messages: [],
                owner: userId,
            })
            .then(() => {
                const longRoomId = roomRef.key;
                const roomId = 1000 + Math.floor(Math.random() * 999);
                roomCollection
                    .doc(roomId.toString())
                    .set({
                        rtdbRoomId: longRoomId,
                    })
                    .then(()=>{
                        res.json({
                            id: roomId.toString()
                        });
                    });
            });
        } else {
            res.status(401).json({
                message: "no existis"
            })
        }
    })
});

// endpoint para ingresar a un room
app.get("/rooms/:roomId", (req, res) => {
    const { roomId } = req.params;
    roomCollection
    .doc(roomId.toString())
    .get()
    .then(snap => {
        const data = snap.data();
        res.json(data);
    })
});

// endpoint para enviar mensajes a un room
// ver bien la vuelta del ID de rtdb y de firestore
app.post("/rooms/:roomId/messages", function(req, res) {
    const { roomId } = req.params;
    const { message } = req.body;
    var longRoomId;
    roomCollection
    .doc(roomId.toString())
    .get()
    .then(snap => {
        // Aca ya tenemos el longRoomId, ahora faltaria tirarle los mensajes (ver si el user va adentro de cada mensaje) a rtdb
        const data = snap.data();
        longRoomId = data.rtdbRoomId;
        const roomRef = rtdb.ref("rooms/" + longRoomId + "/messages");
        roomRef.push(message);
        res.json(roomRef);
    });
});


// login
app.post("/auth", (req, res) => {
    const { email } = req.body;
    userCollection
        .where("email", "==", email)
        .get()
        .then((searchResponse) => {
            if (searchResponse.empty) {
                res.status(404).json({
                    message: "user not found"
                });
            } else {
                res.json({
                    // este id es fundamental
                    id: searchResponse.docs[0].id
                })
            }
        })
});

app.use(express.static("dist"));
app.get("*", (req, res) => {
    res.sendFile(__dirname + "/dist/index.html");
});



app.listen(port, () => console.log("conectado al puerto ", port));