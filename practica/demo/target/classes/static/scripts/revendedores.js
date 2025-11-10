document.addEventListener("DOMContentLoaded", async () => {
    const idUsuario = 1; // Cambia esto por el ID del usuario logueado, si lo tienes en un storage o sesión.
    
    // Elementos de las tablas
    const tablaPedidosBody = document.querySelector("#tablaPedidos tbody");
    const tablaCuentaBody = document.querySelector("#tablaCuenta tbody");

    // Función para cargar los pedidos de un usuario
    async function cargarPedidos() {
        try {
            // Hacer la petición para obtener los pedidos del usuario
            const resp = await fetch(`http://localhost:8080/pedidos/usuario/${idUsuario}`);
            if (!resp.ok) {
                throw new Error("Error cargando los pedidos.");
            }

            const pedidos = await resp.json();
            
            if (pedidos.length === 0) {
                tablaPedidosBody.innerHTML = `<tr><td colspan="3">No tienes pedidos registrados.</td></tr>`;
                tablaCuentaBody.innerHTML = `<tr><td colspan="5">No hay movimientos en la cuenta.</td></tr>`;
                return;
            }

            // Mostrar pedidos en la tabla "Mis Pedidos"
            pedidos.forEach(pedido => {
                const fila = `
                    <tr>
                        <td>${pedido.nroPedido}</td>
                        <td>${pedido.fecha}</td>
                        <td>-</td>  <!-- No se muestra el total en la tabla de pedidos, se obtiene después -->
                    </tr>
                `;
                tablaPedidosBody.innerHTML += fila;
            });

            // Mostrar detalles de los pedidos en la tabla "Cuenta Corriente"
            for (const pedido of pedidos) {
                try {
                    const respBoleta = await fetch(`http://localhost:8080/boletas/pedido/${pedido.nroPedido}`);
                    if (respBoleta.ok) {
                        const dataBoleta = await respBoleta.json();
                        const boleta = dataBoleta.boleta;
                        const total = boleta?.total ? `$${boleta.total.toFixed(2)}` : "-";
                        const estado = boleta?.estado || "N/D";

                        // Agregar fila a la tabla "Cuenta Corriente"
                        tablaCuentaBody.innerHTML += `
                            <tr>
                                <td>${pedido.nroPedido}</td>
                                <td>${pedido.fecha}</td>
                                <td>${total}</td>
                                <td>${estado}</td>
                                <td>
                                    <button class="btn btn-primary btn-sm verBoleta" data-nro="${pedido.nroPedido}">Ver Boleta</button>
                                </td>
                            </tr>
                        `;
                    }
                } catch (err) {
                    console.error("Error cargando la boleta para el pedido:", err);
                }
            }

        } catch (err) {
            console.error("Error cargando los pedidos:", err);
        }
    }

    // Llamar a la función para cargar los pedidos cuando se cargue la página
    cargarPedidos();

    // Agregar eventos a los botones "Ver Boleta"
    tablaCuentaBody.addEventListener("click", (e) => {
        if (e.target.classList.contains("verBoleta")) {
            const nroPedido = e.target.getAttribute("data-nro");
            // Aquí podrías abrir un modal o realizar alguna acción con el número de pedido
            alert("Abrir modal boleta para el pedido: " + nroPedido);
        }
    });
});
