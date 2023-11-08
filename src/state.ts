import firebase from "firebase"; 
import map from "lodash/map";

const api: any = { url: ""};

if (process.env.ENV == "development") {
    api.url = "http://localhost:3000/";
} else if (process.env.ENV == "production") {
    api.url = process.env.BACKEND_URL
}

const state = {
    data: {
        roomId: "",
        nombre: "",
        messages: []
    },
    listeners: [],
    setNombre(nombre:string){
        const currentState = this.getState();
        currentState.nombre = nombre;
        this.setState(currentState);
    },
    init(){
        const database = firebase.database();
        const chatroomsRef = database.ref("/chatrooms/12345/messages");
        const currentState = this.getState();
        chatroomsRef.on("value", (snapshot) => {
            const messagesFromServer = snapshot.val();
            const messagesList = map(messagesFromServer);
            currentState.messages = messagesList;
            this.setState(currentState);
        })
    },
    getState(){
        return this.data;
    },
    addMessage(roomId, message){
        // const nombreDelState = this.data.nombre;
        var nombreDelState = sessionStorage.getItem("nombre");
        fetch(api.url + "/rooms/" + roomId + "/messages", {
        method: "post",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({
            message: message
        }),
        });
    },
    setNombreAndEmail(nombre){
        const currentState = this.getState();
        currentState.nombre = nombre;
        sessionStorage.setItem("nombre", nombre);
        this.setState(currentState);
    },
    setState(newState){
        this.data = newState;
        for (const cb of this.listeners){
            // haciendo esto nos ahorramos leer el estado en el subscribe y siempre recibimos el ultimo estado
            cb(newState);
        }
    },
    subscribe(callback: (any) => any) {
        this.listeners.push(callback);
    },
    createRoom(userEmail, userName, messages) {
        fetch(api.url + "/rooms", {
        method: "post",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({
            email: userEmail,
            name: userName,
            messages: messages
        }),
        })
        .then(data => {
            return data.json();
        })
        .then(data => {
            // aca lo que parece ocurrir es que el cambio que hace al router de page, renderizando el chat ocurre ANTES de que vuelva el llamado a la API con la info.
            console.log("Soy la data antes de invocar a enterRoom", data)
            this.enterRoom(data.id, userName);
        });
    },
    enterRoom(id, nombre){
        const roomId = id.toString();
        var longRoomId;
        fetch(api.url + "/" + roomId,  {
        method: "get",
        headers: {
            "content-type": "application/json",
        },
        })
        .then(data => {
            return data.json();
        })
        .then(data => {
            // esto devuelve el ID complejo de la room en rtdb. aca con este id complejo que deberiamos hacer? conectarnos a la la room y hacer un set state para empezar a leer los mensajes y eso
            longRoomId = data.rtdbRoomId;
            const rtdb = firebase.database();
            const roomRef = rtdb.ref("/rooms/" + longRoomId);
            const currentState = this.getState();
            roomRef.on("value", (snapshot) => {
                const dataFromRoom = snapshot.val();
                currentState.nombre = nombre;
                currentState.roomId = id;
                currentState.messages = dataFromRoom.messages;
                currentState.messages = map(currentState.messages);
                this.setState(currentState);
                console.log("Finished setting state", currentState);
            });
        });
    }
};

export {state};