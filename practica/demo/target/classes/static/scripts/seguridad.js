document.addEventListener("DOMContentLoaded", () => {
    // ... (Código de seguridad y logout, sin cambios) ...
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
        "/dist/pedidos.html",
        "/dist/revendedores.html",
        "/dist/pagos.html",
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
// ========== FUNCIONES PARA BOLETA ==========

// Función para generar y mostrar la boleta
async function generarYMostrarBoleta(nroPedido) {
  try {
    const data = await verificarBoletaExistente(nroPedido);

    if (!data) {
      throw new Error("No se encontró la boleta generada automáticamente.");
    }

    cargarDatosBoleta(data);

    const boletaModal = new bootstrap.Modal(document.getElementById('boletaModal'));
    boletaModal.show();

    alert(`✅ Pedido creado correctamente\nNúmero de pedido: ${nroPedido}\n\nSe ha generado la boleta.`);

  } catch (error) {
    console.error("Error al generar boleta:", error);
    alert("⚠️ Pedido creado pero hubo un error al cargar la boleta. Verifique el log.");
  }
}

// Verificar si ya existe una boleta para el pedido
async function verificarBoletaExistente(nroPedido) {
  try {
    const response = await fetch(`http://localhost:8080/boletas/pedido/${nroPedido}`);
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Cargar los datos en el modal
function cargarDatosBoleta(data) {
  const boleta = data.boleta;
  const pedido = data.pedido;
  const usuario = data.usuario;
  const detalles = data.detalles;

  // Información de la boleta
  document.getElementById("nroBoleta").textContent = `N° ${String(boleta.idBoleta).padStart(6, '0')}`;
  document.getElementById("fechaEmision").textContent = formatearFecha(boleta.fechaEmision);
  document.getElementById("nroPedido").textContent = pedido.nroPedido;

  // Estado de la boleta
  const estadoBadge = document.getElementById("estadoBoleta");
  estadoBadge.textContent = boleta.estado;
  // Usamos rounded-pill para mejor diseño
  estadoBadge.className = `badge rounded-pill fw-normal ${getEstadoClass(boleta.estado)}`;

  // Información del cliente
  document.getElementById("nombreCliente").textContent = `${usuario.nombre} ${usuario.apellido}`;
  document.getElementById("emailCliente").textContent = usuario.email;
  document.getElementById("telefonoCliente").textContent = usuario.telefono || "No especificado";

  // Detalles del pedido
  const tbody = document.getElementById("detallesTabla");
  tbody.innerHTML = "";

  detalles.forEach(detalle => {
    const nombreProducto = detalle.producto ? detalle.producto.nombre : 'Producto Desconocido';
    const subtotal = detalle.cantidad * detalle.precioUnitario;
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${nombreProducto}</td>
      <td class="text-center">${detalle.cantidad}</td>
      <td class="text-end">$${detalle.precioUnitario.toFixed(2)}</td>
      <td class="text-end">$${subtotal.toFixed(2)}</td>
    `;
    tbody.appendChild(fila);
  });

  // Totales
  document.getElementById("subtotal").textContent = `$${boleta.subtotal.toFixed(2)}`;
  document.getElementById("iva").textContent = `$${boleta.iva.toFixed(2)}`;
  document.getElementById("total").textContent = `$${boleta.total.toFixed(2)}`;
}

// Función para ver boleta de un pedido existente
async function verBoleta(nroPedido) {
  try {
    const response = await fetch(`http://localhost:8080/boletas/pedido/${nroPedido}`);

    if (response.ok) {
      const data = await response.json();
      cargarDatosBoleta(data);
      const boletaModal = new bootstrap.Modal(document.getElementById('boletaModal'));
      boletaModal.show();
    } else {
      alert("⚠️ No se encontró boleta para este pedido");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("❌ Error al cargar la boleta");
  }
}

// Formatear fecha
function formatearFecha(fecha) {
  const date = new Date(fecha);
  return date.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

// Obtener clase CSS según el estado
function getEstadoClass(estado) {
  switch (estado) {
    case 'EMITIDA':
      return 'bg-success';
    case 'PAGADA':
      return 'bg-primary';
    case 'ANULADA':
      return 'bg-danger';
    default:
      return 'bg-secondary';
  }
}

// Función para imprimir la boleta (llamada desde el botón del modal)
function imprimirBoleta() {
  window.print();
}
