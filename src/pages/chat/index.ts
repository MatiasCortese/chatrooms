import { state } from "../../state";

customElements.define("chat-page", class extends HTMLElement {
    roomId;
    username;
    messages;
    constructor(){
        super();
        this.username;
        this.roomId;
        this.messages = [];
    };
    connectedCallback(){
        this.functionsPack();
        state.subscribe(() => {
            this.functionsPack();
        });
    };
    functionsPack(){
            const currentState = state.getState();
            this.roomId = currentState.roomId;
            this.username = currentState.nombre;
            this.messages = currentState.messages;
            this.render();
            this.addStyle();
            this.sendMessage();
            this.whoIsWhoChecker();
    };
    render(){
        this.innerHTML = `
            <my-header></my-header>
            <div class="container">
                <my-title>Chat</my-title>
                <h3 class="roomdId">room id: ${this.roomId}</h3>
                <div class="messages-container">
                ${this.messages.map((m) => {
                    return `<chat-box user="${m.nombre}" class="me">${m.message}</chat-box>`
                }).join("")}
                </div>
                <input type="text" class="input-message">
                <my-button class="send-message">Enviar</my-button>
            <div>
        `;
    };
    addStyle(){
        const style = document.createElement("style");
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap');
            .container {
                padding: 18px 33px 50px 28px;
                display: flex;
                flex-direction: column;
                gap: 13px;
            }

            .roomdId {
                font-family: Roboto;
                font-weight: 500;
                font-size: 24px;
                margin: 0;
            }

            .messages-container{
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 12px;
                height: auto;
                justify-content: flex-end;
            }

            .me, .other {
                font-family: 'Roboto', sans-serif;
                width: 43%;
                height: fit-content;
                font-size: 18px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                border-radius: 4px;
                background: #D8D8D8;
                display: inline-block;
                padding: 15px 8px 16px 13px;
            }

            .me {
                background-color: #B9E97C;
                margin-left: 50%;
            }

            .other {
                background-color: #D8D8D8;
            }

            .input-message{
                width: 97.7%;
                height: 55px;
                border-radius: 4px;
                border: 2px solid #000;
            }
        `;
        this.appendChild(style);
    }
    sendMessage(){
        const enviarMessageEl = this.querySelector(".send-message");
        const messageInputEl = this.querySelector(".input-message");
        enviarMessageEl?.addEventListener("click", () => {
            if ((messageInputEl as any).value == "") {
                console.log("Introduzca un mensaje");
            } else {
                const message = {
                    nombre: this.username,
                    message: (messageInputEl as any).value,
                }
                state.addMessage(this.roomId, message);
            }
        });
    };
    whoIsWhoChecker(){
        const messages = this.querySelectorAll("chat-box");
        messages.forEach((message) => {
            if (message.getAttribute("user") != this.username) {
                message.classList.remove("me");
                message.classList.add("other");
            }
        });
    };
});