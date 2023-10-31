customElements.define("input-text", class extends HTMLElement {
    type;
    constructor(){
        super();
        this.type = this.getAttribute("for");
    }
    connectedCallback(){
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

            .input {
                width: 97.6%;
                height: 55px;
                border-radius: 4px;
                border: 2px solid #000;
            }
        `;
        this.appendChild(style);
    };  
    render(){
        this.innerHTML = `<div class="input-container">
            <label for=${this.type}>${this.type}</label>
            <input class="input"type="text">
        </div>`;
    };
}); 