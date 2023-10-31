customElements.define("my-title", class extends HTMLElement{
    connectedCallback(){
        this.render();
        const style = document.createElement("style");
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap');
            .title {
                font-family: Roboto;
                font-size: 52px;
                font-style: normal;
                font-weight: 700;
                line-height: normal;
                margin: 0;
            }
        `;
        this.appendChild(style);
    };
    render(){
        this.innerHTML = `<h1 class="title">${this.innerHTML}</h1>`;
    };
});