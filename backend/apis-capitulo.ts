import * as express from "express";
import { firestore, rtdb } from "./db";
import * as cors from "cors";
import { nanoid } from "nanoid";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const userCollection = firestore.collection("users");
const roomCollection = firestore.collection("rooms");

// el proceso de autenticacion es una forma de que las personas/clientes se conecten al backend y nos diga quienes son
// se compone de un signup (registro) y un authentication (login)

// signup nos da de alta en la bd
app.post("/signup", (req, res) => {
    // esto es igual que escribir const email = req.body.email
    // recibimos la data en el body;
    const { email } = req.body;
    const { nombre } = req.body;
    // nos fijamos si hay un user con ese email
    userCollection
        .where("email", "==", email)
        .get()
        .then((searchResponse) => {
        // si no hay user con ese email, lo creamos y en el res.json devolvemos al usuario el ID del recien creado
        if(searchResponse.empty){
            userCollection.add({
                email,
                nombre
            }).then((newUserRef) => res.json({
                // este ID es que utilizaremos para identificarnos, no de modo directo si no pidiendole al backend que nos devuelva ntro ID, es ntra llave para decirle quien smos
                id: newUserRef.id,
                new: true
            }));
        } else {
            res.status(400).json({
                message: "user already exists"
            })
        };
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

// en firestore guardaremos la data posta
// en firebase para data temporal que va y viene

// endpoint para crear un room y que nos devuelva su ID
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
    const { userId } = req.query;
    const { roomId } = req.params;
    // pasamos el id a string, hacemos el get y si el usuario existe, podemos ingresar al room
    userCollection
    .doc(userId.toString())
    .get()
    .then(doc => {
        if (doc.exists){
            roomCollection
            .doc(roomId.toString())
            .get()
            .then(snap => {
                const data = snap.data();
                res.json(data);
            }); 
        } else {
            res.status(401).json({
                message: "no existis"
            })
        }
    })
});


app.listen(port, () => console.log("conectado al puerto ", port));