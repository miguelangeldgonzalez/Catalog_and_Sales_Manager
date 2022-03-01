var dragging;
function endDrag(e){
    dragging = this;
}
function dropElement(e){
    console.log(dragging);
    let id = dragging.getAttribute("itemid");
    this.appendChild(document.querySelector(`.circle[itemid='${id}']`));
}
document.querySelectorAll(".move").forEach(div => {
    div.addEventListener("dragstart", e => {
        dragging = undefined;
    })
});
document.querySelectorAll(".move").forEach(div => {
    div.addEventListener("dragend", endDrag)
});
document.querySelectorAll(".conteiner").forEach(div => {
    div.addEventListener("dragover", e => {
        e.preventDefault();
    })
});
document.querySelectorAll(".conteiner").forEach(div => {
    div.addEventListener("drop", dropElement);
});