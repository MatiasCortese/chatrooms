customElements.define("my-button", class extends HTMLElement {
    text;
    constructor(){
        super();
        this.text = this.innerText;
    }
    connectedCallback(){
        this.render();
        const style = document.createElement("style");
        style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500;700&display=swap');
            .button {
                color: #000;
                text-align: center;
                font-family: Roboto;
                font-size: 22px;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
                width: 100%;
                height: 55px;
                border-radius: 4px;
                background: #9CBBE9;
                border: none;
            }

            .button:hover {
                cursor: pointer;
            }
        `;
        this.appendChild(style);
    };  
    render(){
        this.innerHTML = `<button class="button">${this.innerText}</button>`;
    };
}); 