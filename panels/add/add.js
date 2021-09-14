import {s, postForm} from "./../../js/app.js";

s("#add").addEventListener("submit", e => {
    e.preventDefault();

    console.log("hola");
});

/*$("#formulario").submit(function (e) {
    e.preventDefault();

    $.ajax({
        method: "POST",
        data: new FormData(this),
        url: dir + "device-add.php",
        contentType: false,
        processData: false,
        cache: false,
        beforeSend: function () {

        },
        success: function (response) {
            response = parseInt(response);
            switch (response) {
                case 1:
                    alert("La imagen supera los 2 MB");
                    break;
                case 2:
                    alert("La imagen tiene un formato no admitido");
                    break;
                case 3:
                    alert("Dispositivo añadido correctamente");
                    $("#formulario")[0].reset();
                    fetchDevices();
                    showControlDevices();
                    break;
                default:
                    alert("Archivo de imagen no admitido");
                }
        }
    });
});*/
