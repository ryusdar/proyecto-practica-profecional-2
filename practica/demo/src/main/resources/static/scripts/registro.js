document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formRegistro");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        // Capturar los datos del formulario
        const nombre = document.getElementById("nombre").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        const email = document.getElementById("email").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const clave = document.getElementById("clave").value.trim();

        // Validación básica
        if (!nombre || !apellido || !email || !telefono || !clave) {
            alert("Por favor complete todos los campos.");
            return;
        }

        // Crear objeto usuario (sin rol ni fecha_alta, lo maneja el backend)
        const usuario = {
            nombre,
            apellido,
            email,
            telefono,
            contraseña: clave,  // Igual que en tu BD
            activo: 1
        };

        try {
            const response = await fetch("http://localhost:8080/usuarios/registrar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(usuario)
            });

            if (response.ok) {
                alert("Usuario registrado correctamente.");
                form.reset();
                window.location.href = "/index.html"; 
            } else {
                const error = await response.text();
                alert("Error al registrar: " + error);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("No se pudo conectar con el servidor.");
        }
    });
});
