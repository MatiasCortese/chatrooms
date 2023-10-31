customElements.define("my-header", class extends HTMLElement {
    connectedCallback(){
        this.render();
        const style = document.createElement("style");
        style.innerHTML = `
            .header {
                height: 60px;
                background-color: #FF8282;
            }
        `;
        this.appendChild(style);
    };  
    render(){
        this.innerHTML = `<div class="header"></div>`;
    };
}); 