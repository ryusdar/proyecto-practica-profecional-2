document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const path = window.location.pathname;

    // Si no está logueado, lo mandamos al login
    if (!usuario) {
        alert("Debe iniciar sesión para acceder a esta página.");
        window.location.href = "../index.html";
        return;
    }

    const rol = parseInt(usuario.rol);

    // 🔒 Rutas habilitadas por rol
    const rutasRevendedor = [
        "/dist/pedidos.html",
        "/dist/revendedores.html",
        "/dist/pagos.html"
    ];
    const rutasAdmin = [
        "/dist/administracion.html"
    ];

    // Verificación de acceso
    if (rol === 2 && !rutasRevendedor.includes(path)) {
        alert("No tiene permiso para acceder a esta sección.");
        window.location.href = "pedidos.html";
        return;
    }

    if (rol === 1 && !rutasAdmin.includes(path)) {
        alert("No tiene permiso para acceder a esta sección.");
        window.location.href = "administracion.html";
        return;
    }
});
document.addEventListener("click", (e) => {
    if (e.target.id === "logout") {
        localStorage.removeItem("usuario");
        window.location.href = "../index.html";
    }
});