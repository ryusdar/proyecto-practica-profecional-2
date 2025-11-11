document.addEventListener("DOMContentLoaded", async () => {
    const tablaPedidosBody = document.querySelector("#tablaPedidos tbody");

    async function cargarPedidos() {
        try {
            const resp = await fetch(`http://localhost:8080/pedidos/usuario/1`);
            
            if (!resp.ok) {
                throw new Error("Error cargando los pedidos.");
            }

            const text = await resp.text();
            console.log("Respuesta del servidor:", text);  // Muestra la respuesta cruda

            const pedidos = JSON.parse(text);

            if (pedidos.length === 0) {
                tablaPedidosBody.innerHTML = `<tr><td colspan="3">No tienes pedidos registrados.</td></tr>`;
                return;
            }

            // Filtrar la respuesta para obtener solo los campos necesarios
            const pedidosFiltrados = pedidos.map(pedido => ({
                nroPedido: pedido.nroPedido,
                fecha: pedido.fecha,
                total: pedido.boleta ? pedido.boleta.total : 0.0 // Asumiendo que 'boleta' contiene el 'total'
            }));

            // Mostrar los pedidos
            pedidosFiltrados.forEach(pedido => {
                const fila = `
                    <tr>
                        <td>${pedido.nroPedido}</td>
                        <td>${pedido.fecha}</td>
                        <td>${pedido.total}</td>
                    </tr>
                `;
                tablaPedidosBody.innerHTML += fila;
            });

        } catch (err) {
            console.error("Error cargando los pedidos:", err);
        }
    }

    cargarPedidos();
});
