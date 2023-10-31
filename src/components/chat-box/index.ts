customElements.define("chat-box", class extends HTMLElement {
    shadow: ShadowRoot;
    user;
    constructor(){
        super();
        this.shadow = this.attachShadow({mode: "open"})
    }
    connectedCallback(){
        (this.user as any) = this.getAttribute("user");
        const style = document.createElement("style");
        style.innerHTML = `
            .chat-box {
                height: 60px;
            }
            .nickname {
                color: #A5A5A5;
            }
        `;
        this.shadow.appendChild(style);
        this.render();
    };  
    render(){
        const div = document.createElement("div");
        div.innerHTML = `
        <div class="chat-box" user="${this.user}">
            <div class="nickname">${this.user}</div>
            <div>
                ${this.textContent}
            </div>
        </div>`;
        this.shadow.appendChild(div);
    };
}); 