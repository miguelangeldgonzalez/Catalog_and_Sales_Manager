document.querySelector("#action").addEventListener("click", e => {
    fetch("files.php")
        .then(r => r.text())
        .then(r => {
            console.log(r);
        });
})