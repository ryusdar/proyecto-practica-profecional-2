document.addEventListener("DOMContentLoaded", async () => {
    const tablaPedidosBody = document.querySelector("#tablaPedidos tbody");

    async function cargarPedidos() {
        tablaPedidosBody.innerHTML = ""; // limpiar tabla

        try {
            // 1) Traemos todos los pedidos del usuario
            const resp = await fetch(`http://localhost:8080/pedidos/usuario/1`);
            const pedidos = await resp.json();

            if (!Array.isArray(pedidos) || pedidos.length === 0) {
                tablaPedidosBody.innerHTML = `
                    <tr><td colspan="3">No tienes pedidos registrados.</td></tr>
                `;
                return;
            }

            // 2) Recorremos los pedidos y buscamos su boleta para obtener el total
            for (const pedido of pedidos) {
                const nroPedido = pedido.nroPedido;
                let totalBoleta = 0;

                try {
                    const respBoleta = await fetch(`http://localhost:8080/boletas/pedido/${nroPedido}`);

                    if (respBoleta.ok) {
                        const dataBoleta = await respBoleta.json();
                        totalBoleta = dataBoleta.boleta.total ?? 0;
                    } else {
                        console.warn(`No se encontró boleta para pedido ${nroPedido}`);
                    }

                } catch (error) {
                    console.error("Error trayendo boleta:", error);
                }

                // 3) Insertamos fila en la tabla
                const fila = `
                    <tr>
                        <td>${nroPedido}</td>
                        <td>${pedido.fecha ?? "Sin fecha"}</td>
                        <td>$${totalBoleta.toFixed(2)}</td>
                    </tr>
                `;

                tablaPedidosBody.innerHTML += fila;
            }

        } catch (err) {
            console.error("Error cargando pedidos:", err);
            tablaPedidosBody.innerHTML = `
                <tr><td colspan="3">Error cargando los pedidos.</td></tr>
            `;
        }
    }

    cargarPedidos();
});
