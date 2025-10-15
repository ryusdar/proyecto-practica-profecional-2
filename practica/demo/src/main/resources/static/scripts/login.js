document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const usuario = document.getElementById("usuario").value.trim();
        const clave = document.getElementById("clave").value.trim();

        if (!usuario || !clave) {
            alert("Por favor ingrese usuario y contraseña.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/usuarios/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: usuario, contraseña: clave })
            });

            if (!response.ok) {
                throw new Error("Error de autenticación");
            }

            const data = await response.json();

            // Guardamos los datos del usuario logueado
            localStorage.setItem("usuario", JSON.stringify(data));

            alert(`Bienvenido ${data.nombre} (${data.rol == 1 ? "Administrador" : "Revendedor"})`);

            // Redirección según el rol
            if (data.rol == 1) {
                window.location.href = "dist/administracion.html";
            } else {
                window.location.href = "dist/pedidos.html";
            }

        } catch (error) {
            alert("Usuario o contraseña incorrectos");
            console.error(error);
        }
    });
});
