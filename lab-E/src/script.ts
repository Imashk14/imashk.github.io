const msg: string = "Hello!";
alert(msg);

const style1 = document.createElement("link");
style1.rel = "stylesheet";
style1.href = "/style-1.css"

const style2 = document.createElement("link");
style2.rel = "stylesheet";
style2.href = "/style-2.css"

const style3 = document.createElement("link");
style3.rel = "stylesheet";
style3.href = "/style-3.css";

const styles = [style1, style2, style3];
document.head.appendChild(style1);

const nav = document.createElement("nav");
for (let i = 0; i < styles.length; i++) {
    const button = document.createElement("button");
    button.className = "style-button";
    button.textContent = "Style " + (i + 1);
    button.addEventListener("click", () => {
        document.querySelectorAll("link[rel='stylesheet']").forEach(link => link.remove());
        document.head.appendChild(styles[i]);
    })
    nav.appendChild(button);
}

const header = document.querySelector("header");
if (header) {
    header.appendChild(nav);
} else {
    document.body.appendChild(nav);
}
