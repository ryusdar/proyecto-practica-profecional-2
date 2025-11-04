// revendedores.js - Muestra pedidos del revendedor y abre modal con boleta
document.addEventListener("DOMContentLoaded", async () => {
  // --- 1. Referencias y Variables Iniciales ---
  const revBody = document.getElementById("revBody");
  const noPedidos = document.getElementById("noPedidos");
  const uidDisplay = document.getElementById("uidDisplay");

  // Obtiene el ID del usuario del almacenamiento local o usa 1 por defecto.
  const idUsuario = parseInt(localStorage.getItem("id_usuario") || localStorage.getItem("idUsuario") || 1, 10);
  uidDisplay.textContent = idUsuario;

  // Obtener nroPedido desde query param para resaltar y abrir el modal
  const params = new URLSearchParams(window.location.search);
  const highlightPedido = params.get("nroPedido") ? parseInt(params.get("nroPedido"), 10) : null;

  // --- 2. Traer Pedidos del Usuario ---
  let pedidos = [];
  const pedidosUrl = `http://localhost:8080/pedidos/usuario/${idUsuario}`;

  try {
    const resp = await fetch(pedidosUrl);

    if (!resp.ok) {
        // Si el servidor devuelve un error HTTP (ej. 404, 500)
        throw new Error(`Error ${resp.status}: El servidor no respondió correctamente.`);
    }

    // Usamos resp.text() para capturar cualquier respuesta no JSON
    const text = await resp.text();

    if (!text || text.toLowerCase().trim() === 'null' || text.trim() === '[]') {
        pedidos = [];
    } else {
        try {
            pedidos = JSON.parse(text);
        } catch (jsonErr) {
            // Este es el error "Unexpected token" que viste inicialmente
            console.error("No se pudo parsear el JSON de pedidos. Respuesta del servidor:", text);
            throw new Error("El servidor devolvió una respuesta que no es JSON válido. Revisa el backend.");
        }
    }

  } catch (err) {
    console.error("🚨 No se pudieron obtener pedidos:", err);
    alert(`Error al cargar pedidos. Mensaje: ${err.message}. Revisa la consola y el servidor en ${pedidosUrl}.`);
    return;
  }

  // --- 3. Renderizado y Lógica de Pedidos ---
  if (!pedidos || pedidos.length === 0) {
    noPedidos.style.display = "block";
    return;
  } else {
    noPedidos.style.display = "none";
  }

  // Prepara y ejecuta las consultas de boletas en paralelo
  const boletaPromises = pedidos.map(async (pedido) => {
    const nroPedido = pedido.nroPedido || pedido.nro_pedido || pedido.id || null;
    const fecha = pedido.fecha || pedido.fechaCreacion || "";

    const fila = document.createElement("tr");
    fila.setAttribute("data-nropedido", nroPedido);

    fila.innerHTML = `
      <td>${nroPedido}</td>
      <td>${fecha}</td>
      <td><span class="badge bg-secondary badge-status">Cargando...</span></td>
      <td class="text-end">-</td>
      <td>
        <button class="btn btn-sm btn-primary verBoleta" data-nropedido="${nroPedido}">Ver boleta</button>
      </td>
    `;
    revBody.prepend(fila);

    // Llama a la API de boletas
    try {
      const bResp = await fetch(`http://localhost:8080/boletas/pedido/${nroPedido}`);

      if (!bResp.ok) {
        fila.querySelector(".badge-status").className = "badge bg-warning badge-status";
        fila.querySelector(".badge-status").textContent = "Sin boleta";
        fila.querySelector("td.text-end").textContent = "-";
        return;
      }

      const data = await bResp.json();
      const boleta = data.boleta || {};

      // Actualizar estado y total
      const estadoBadge = fila.querySelector(".badge-status");
      const estadoTexto = boleta.estado || "N/D";
      let estadoClass;
      switch (estadoTexto) {
          case "EMITIDA":
              estadoClass = "bg-success";
              break;
          case "PAGADA":
              estadoClass = "bg-primary";
              break;
          case "ANULADA":
              estadoClass = "bg-danger";
              break;
          default:
              estadoClass = "bg-secondary";
      }

      estadoBadge.className = `badge rounded-pill badge-status ${estadoClass}`;
      estadoBadge.textContent = estadoTexto;
      fila.querySelector("td.text-end").textContent = (boleta.total != null) ? `$${Number(boleta.total).toFixed(2)}` : "-";

      // Resaltar y abrir modal si se especificó en la URL
      if (highlightPedido && nroPedido === highlightPedido) {
        fila.classList.add("highlight");
        setTimeout(() => {
          openBoletaModal(nroPedido);
        }, 250);
      }
    } catch (err) {
      console.error("Error al obtener boleta para pedido", nroPedido, err);
      const estadoBadge = fila.querySelector(".badge-status");
      estadoBadge.className = "badge bg-danger badge-status";
      estadoBadge.textContent = "Error";
      fila.querySelector("td.text-end").textContent = "-";
    }
  });

  // Esperar a que se completen todas las promesas de las boletas
  await Promise.all(boletaPromises);

  // --- 4. Event Listeners ---
  revBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("verBoleta")) {
      const nro = e.target.getAttribute("data-nropedido");
      openBoletaModal(nro);
    }
  });

  // --- 5. Funciones Auxiliares ---

  async function openBoletaModal(nroPedido) {
    try {
      const resp = await fetch(`http://localhost:8080/boletas/pedido/${nroPedido}`);
      if (!resp.ok) {
        alert("No se encontró la boleta para ese pedido.");
        return;
      }

      const data = await resp.json();
      const boleta = data.boleta || {};
      const pedido = data.pedido || {};
      const usuario = data.usuario || {};
      const detalles = data.detalles || [];

      // Rellenar Modal: Datos Generales
      document.getElementById("nroBoleta").textContent = `N° ${boleta.idBoleta ? String(boleta.idBoleta).padStart(6,'0') : '000000'}`;
      document.getElementById("nombreCliente").textContent = usuario.nombre ? `${usuario.nombre} ${usuario.apellido || ''}` : (usuario.username || '-');
      document.getElementById("emailCliente").textContent = usuario.email || "-";
      document.getElementById("telefonoCliente").textContent = usuario.telefono || "-";
      document.getElementById("fechaEmision").textContent = boleta.fechaEmision || boleta.fecha || "";
      document.getElementById("nroPedidoDetalle").textContent = pedido.nroPedido || nroPedido;

      const estadoEl = document.getElementById("estadoBoleta");
      const estadoTexto = boleta.estado || "-";
      const estadoClass = (estadoTexto === "EMITIDA") ? "bg-success" : (estadoTexto === "PAGADA") ? "bg-primary" : (estadoTexto === "ANULADA") ? "bg-danger" : "bg-secondary";
      estadoEl.className = `badge rounded-pill fw-normal ${estadoClass}`;
      estadoEl.textContent = estadoTexto;

      // Rellenar Modal: Detalles
      const detallesTabla = document.getElementById("detallesTabla");
      detallesTabla.innerHTML = "";
      let sumaSubtotal = 0;

      detalles.forEach(d => {
        const nombre = (d.producto && d.producto.nombre) ? d.producto.nombre : (d.nombreProducto || 'Producto');
        const cantidad = d.cantidad || d.cant || 0;
        const precio = (d.producto && d.producto.precio) ? Number(d.producto.precio) : (Number(d.precio) || 0);
        const subtotal = (d.subtotal != null) ? Number(d.subtotal) : (precio * cantidad);

        sumaSubtotal += subtotal;

        detallesTabla.innerHTML += `
          <tr>
            <td>${nombre}</td>
            <td class="text-center">${cantidad}</td>
            <td class="text-end">$${precio.toFixed(2)}</td>
            <td class="text-end">$${subtotal.toFixed(2)}</td>
          </tr>
        `;
      });

      // Rellenar Modal: Totales
      const finalSubtotal = (boleta.subtotal != null) ? Number(boleta.subtotal) : sumaSubtotal;
      const finalIva = (boleta.iva != null) ? Number(boleta.iva) : (finalSubtotal * 0.19);
      const finalTotal = (boleta.total != null) ? Number(boleta.total) : (finalSubtotal + finalIva);

      document.getElementById("subtotal").textContent = `$${finalSubtotal.toFixed(2)}`;
      document.getElementById("iva").textContent = `$${finalIva.toFixed(2)}`;
      document.getElementById("total").textContent = `$${finalTotal.toFixed(2)}`;

      // Mostrar modal
      new bootstrap.Modal(document.getElementById("boletaModal")).show();
    } catch (err) {
      console.error("Error al abrir boleta:", err);
      alert("Error al obtener la boleta. Revisa el servidor y el JSON de respuesta.");
    }
  }
});
