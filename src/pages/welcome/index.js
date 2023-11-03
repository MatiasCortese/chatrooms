import "../../components/header";
import "../../components/title";
import "../../components/input-text";
import "../../components/input-select";
import "../../components/button";
import { state } from "../../state";
customElements.define("welcome-page", class extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.render();
        this.querySelector(".button").addEventListener("click", this.getInputsData);
        this.querySelector("#roomType").addEventListener("change", this.getRoomType);
        const style = document.createElement("style");
        style.innerHTML = `
            .container {
                padding: 18px 33px 50px 28px;
                display: flex;
                flex-direction: column;
                gap: 13px;
            }

            .room-id-form {
                display: none;
            }

            .show {
                display: block;
            }

            .button {
                margin-top: 40px;
            }

        `;
        this.appendChild(style);
    }
    ;
    render() {
        this.innerHTML = `
            <div>
                <my-header></my-header>
                <div class="container">
                    <my-title>Bienvenidx</my-title>
                    <input-text id="email" for="email"></input-text>
                    <input-text id="nombre" for="tu nombre"></input-text>
                    <input-select id="roomType" for="room"></input-select>
                    <input-text class="room-id-form" for="room id"></input-text>
                    <a href="/chat"><my-button class="button">Comenzar</my-button></a>
                </div>
            </div>
        `;
    }
    ;
    getInputsData() {
        const email = document.querySelector("#email").querySelector(".input").value;
        const nombre = document.querySelector("#nombre").querySelector(".input").value;
        const roomId = document.querySelector(".room-id-form").querySelector(".input").value;
        if (!email || !nombre) {
            alert("te falta data ameo");
            window.location.href = "http://localhost:1234/";
        }
        if (email && nombre && roomId) {
            // invocar a funcion del state que vaya al room existente
            state.enterRoom(roomId, nombre);
        }
        if (email && nombre && !roomId) {
            const messages = false;
            // invocar funcion del state que cree una nueva room
            state.createRoom(email, nombre, messages);
        }
    }
    ;
    getRoomType() {
        const roomType = document.querySelector(".select").value;
        if (roomType == "room-existente") {
            document.querySelector(".room-id-form").classList.add("show");
        }
        else {
            document.querySelector(".room-id-form").classList.toggle("show");
        }
    }
    ;
});
