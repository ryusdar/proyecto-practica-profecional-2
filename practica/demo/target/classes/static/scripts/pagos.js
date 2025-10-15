// Obtener número de pedido de la URL
const params = new URLSearchParams(window.location.search);
const pedido = params.get("pedido");

// Ejemplo de pedidos (puede venir de tu base de datos)
const pedidos = {
    "001": { fecha: "05/10/2025", total: 7500 },
    "002": { fecha: "02/10/2025", total: 12500 }
};

// Mostrar detalle del pedido
const detalleDiv = document.getElementById("detallePedido");
if (pedido && pedidos[pedido]) {
    detalleDiv.innerHTML = `
        <p><strong>Número de Pedido:</strong> ${pedido}</p>
        <p><strong>Fecha:</strong> ${pedidos[pedido].fecha}</p>
        <p><strong>Total:</strong> $${pedidos[pedido].total}</p>
    `;
} else {
    detalleDiv.innerHTML = "<p>No se ha seleccionado ningún pedido o pedido no encontrado.</p>";
}

// Cambiar campos dinámicos según forma de pago
const formaPagoSelect = document.getElementById("formaPago");
const camposDinamicos = document.getElementById("camposDinamicos");

formaPagoSelect.addEventListener("change", () => {
    const valor = formaPagoSelect.value;
    camposDinamicos.innerHTML = ""; // limpiar campos

    if (valor === "Tarjeta") {
        camposDinamicos.innerHTML = `
            <div class="mb-3">
                <label class="form-label">Número de Tarjeta</label>
                <input type="text" class="form-control" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Nombre del Titular</label>
                <input type="text" class="form-control" required>
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Fecha de Vencimiento</label>
                    <input type="month" class="form-control" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">CCV</label>
                    <input type="text" class="form-control" required>
                </div>
            </div>
        `;
    } else if (valor === "Transferencia") {
        camposDinamicos.innerHTML = `
            <div class="mb-3">
                <label class="form-label">Adjuntar Comprobante de Transferencia</label>
                <input type="file" class="form-control" accept=".jpg,.png,.pdf" required>
            </div>
        `;
    }
});

// Envío del formulario
document.getElementById("formPago").addEventListener("submit", (e) => {
    e.preventDefault();
    alert(`Pago del pedido ${pedido} procesado ✅`);
    // Aquí podrías enviar los datos a tu servidor
});

document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("usuario");
    window.location.href = "../index.html";
});
