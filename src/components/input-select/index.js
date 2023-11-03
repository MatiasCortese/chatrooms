customElements.define("input-select", class extends HTMLElement {
    roomType;
    constructor() {
        super();
        this.roomType = this.getAttribute("for");
    }
    connectedCallback() {
        this.render();
        const style = document.createElement("style");
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500;700&display=swap');
            .input-container {
                display: flex;
                flex-direction: column;
                font-family: Roboto;
                font-size: 24px;
                font-weight: 500;
            }

            .select {
                width: 100%;
                height: 55px;
                border-radius: 4px;
                border: 2px solid #000;
            }
        `;
        this.appendChild(style);
    }
    ;
    render() {
        this.innerHTML = `<div class="input-container">
            <label for=${this.roomType}>${this.roomType}</label>
            <select class="select" for=${this.roomType}>
                <option value="nuevo-room">Nuevo room</option>
                <option value="room-existente">Room existente</option>
            </select>
        </div>`;
    }
    ;
});
