document.addEventListener("DOMContentLoaded", function() {
const formRecuperar = document.getElementById("formRecuperar");

formRecuperar.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("emailRecuperar").value;
    const nuevaContraseña = document.getElementById("nuevaContraseña").value;

    try {
        const response = await fetch("/usuarios/recuperar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, nuevaContraseña })
        });

        if (response.ok) {
            alert("Contraseña cambiada correctamente.");
            formRecuperar.reset();
            window.location.href = "/index.html"; 
        } else {
            const msg = await response.text();
            alert("Error: " + msg);
        }
    } catch (error) {
        console.error(error);
        alert("Error al conectar con el servidor.");
    }

    })
});
