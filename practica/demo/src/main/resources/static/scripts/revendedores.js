document.addEventListener("DOMContentLoaded", async () => {

  const idUsuario = parseInt(localStorage.getItem("id_usuario") || 1);

  const tablaPedidosBody = document.querySelector("#tablaPedidos tbody");
  const tablaCuentaBody = document.querySelector("#tablaCuenta tbody");

  // --- Traer pedidos del usuario ---
  let pedidos = [];
  try {
      const resp = await fetch(`http://localhost:8080/pedidos/usuario/${idUsuario}`);
      pedidos = await resp.json();
      console.log("Pedidos desde backend:", pedidos);
  } catch (e) {
      console.error("Error cargando pedidos: ", e);
      return;
  }

  // --- Si no hay pedidos ---
  if (!pedidos || pedidos.length === 0) {
      tablaPedidosBody.innerHTML = `<tr><td colspan="3">No tenés pedidos registrados.</td></tr>`;
      tablaCuentaBody.innerHTML = `<tr><td colspan="5">No hay movimientos en la cuenta.</td></tr>`;
      return;
  }

  // --- Cargar en TAB “Mis Pedidos” ---
  pedidos.forEach(p => {
      const fila = `
        <tr>
          <td>${p.nroPedido}</td>
          <td>${p.fecha || ""}</td>
          <td>-</td>   <!-- Total no existe en Pedido, así que mostramos '-' -->
        </tr>`;
      tablaPedidosBody.innerHTML += fila;
  });

  // --- Cargar TAB “Cuenta Corriente” ---
  for (const p of pedidos) {
      let estado = "SIN BOLETA";
      let total = "-";

      try {
          const respB = await fetch(`http://localhost:8080/boletas/pedido/${p.nroPedido}`);
          if (respB.ok) {
              const data = await respB.json();
              const boleta = data.boleta;

              estado = boleta?.estado || "N/D";
              total = boleta?.total ? `$${boleta.total.toFixed(2)}` : "-";
          }
      } catch (err) {
          console.error("Error cargando boleta:", err);
      }

      tablaCuentaBody.innerHTML += `
        <tr>
          <td>${p.nroPedido}</td>
          <td>${p.fecha || ""}</td>
          <td>${total}</td>
          <td>${estado}</td>
          <td>
            <button class="btn btn-primary btn-sm verBoleta" data-nro="${p.nroPedido}">Ver Boleta</button>
          </td>
        </tr>
      `;
  }

  // --- Evento para abrir boleta ---
  tablaCuentaBody.addEventListener("click", (e) => {
      if (e.target.classList.contains("verBoleta")) {
          const nro = e.target.getAttribute("data-nro");
          alert("Abrir modal boleta pedido: " + nro);
      }
  });

});
