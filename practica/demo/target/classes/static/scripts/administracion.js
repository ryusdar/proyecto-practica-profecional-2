const API_BASE = "http://localhost:8080";
const UMBRAL_STOCK_BAJO = 5;
const STOCK_OBJETIVO = 10;

let productos = [];

// ==================== EVENT LISTENER PRINCIPAL ====================

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Carga el contenido de la primera pestaña activa (Stock)
  await cargarProductosDesdeBD();

  // 2. Asigna listeners de la pestaña Stock
  document.getElementById("filterInsumo").addEventListener("input", filtrarProductos);
  document.getElementById("filterCantidadMin").addEventListener("input", filtrarProductos);
  document.getElementById("filterCantidadMax").addEventListener("input", filtrarProductos);
  document.getElementById("pedidoAuto").addEventListener("click", generarPedidoAutomatico);

  // 3. Asigna listeners para las OTRAS pestañas (para que carguen su contenido AL HACER CLIC)
  const usuariosTab = document.getElementById("usuarios-tab");
  if (usuariosTab) {
    // Usamos 'shown.bs.tab' para que solo cargue cuando la pestaña se muestra
    usuariosTab.addEventListener('shown.bs.tab', cargarUsuarios);
    document.getElementById("btnNuevoUsuario")?.addEventListener("click", () => abrirModalUsuario());
    document.getElementById("formUsuario")?.addEventListener("submit", guardarUsuario);
  }

  const facturaTab = document.getElementById("factura-tab");
  if (facturaTab) {
    facturaTab.addEventListener('shown.bs.tab', cargarBoletasGeneradas);
  }
});


// ==================== TAB 1: STOCK ====================

// 🟢 Cargar productos desde la BD
async function cargarProductosDesdeBD() {
  try {
    const resp = await fetch(`${API_BASE}/productos`);
    if (!resp.ok) throw new Error("Error al cargar productos");
    const data = await resp.json();

    productos = data.map(p => ({
      id: p.idProducto,
      nombre: p.nombre,
      precio: p.precio?.parsedValue ?? 0,
      stock: Number(p.stock),
      categoria: p.idCategoria
    }));

    mostrarProductos(productos);
  } catch (error) {
    console.error("Error en cargarProductosDesdeBD:", error);
    // Asegurarse de que el tbody existe antes de escribir en él
    const tbody = document.querySelector("#tablaStock tbody");
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="2" class="text-danger">Error al cargar productos</td></tr>`;
    }
  }
}

// 🧾 Mostrar productos
function mostrarProductos(lista) {
  const tbody = document.querySelector("#tablaStock tbody");

  // Esta línea era la que fallaba (tbody era null)
  tbody.innerHTML = "";

  if (lista.length === 0) {
    tbody.innerHTML = `<tr><td colspan="2">No se encontraron productos</td></tr>`;
    return;
  }

  lista.forEach(p => {
    const fila = `
      <tr>
        <td>${p.nombre}</td>
        <td>${p.stock}</td>
      </tr>`;
    tbody.insertAdjacentHTML("beforeend", fila);
  });
}

// 🔍 Filtrar
function filtrarProductos() {
  const texto = document.getElementById("filterInsumo").value.toLowerCase();
  const min = parseInt(document.getElementById("filterCantidadMin").value) || 0;
  const max = parseInt(document.getElementById("filterCantidadMax").value) || Infinity;

  const filtrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(texto) &&
    p.stock >= min &&
    p.stock <= max
  );

  mostrarProductos(filtrados);
}

// 📦 Generar tabla editable
async function generarPedidoAutomatico() {
  const bajos = productos.filter(p => Number(p.stock) < UMBRAL_STOCK_BAJO);

  if (bajos.length === 0) {
    mostrarToast("✅ No hay productos con stock bajo.", "success");
    return;
  }

  const contenedor = document.getElementById("pedidoEditable");
  contenedor.style.display = "block";

  const tbody = document.querySelector("#tablaPedidoEditable tbody");
  tbody.innerHTML = "";

  bajos.forEach(p => {
    const fila = `
      <tr>
        <td>${p.nombre}</td>
        <td>${p.stock}</td>
        <td><input type="number" class="form-control text-center cantidad-pedido"
                   data-id="${p.id}"
                   data-nombre="${p.nombre}"
                   min="1"
                   placeholder="Ej: 10" /></td>
      </tr>`;
    tbody.insertAdjacentHTML("beforeend", fila);
  });

  document.getElementById("confirmarPedido").onclick = () => confirmarPedido(bajos);
}

// 🧾 Confirmar pedido, generar PDF y actualizar stock
async function confirmarPedido(bajos) {
  const inputs = document.querySelectorAll(".cantidad-pedido");
  const seleccion = [];

  inputs.forEach(input => {
    const id = Number(input.dataset.id);
    const nombre = input.dataset.nombre;
    const cantidad = Number(input.value);
    const prod = bajos.find(p => p.nombre === nombre);
    if (cantidad > 0) seleccion.push({ ...prod, cantidad, id });
  });

  if (seleccion.length === 0) {
    mostrarToast("⚠️ No se ingresó ninguna cantidad.", "warning");
    return;
  }

  try {
    for (const prod of seleccion) {
      const nuevoStock = prod.stock + prod.cantidad;
      await fetch(`${API_BASE}/productos/${prod.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idProducto: prod.id,
          nombre: prod.nombre,
          precio: prod.precio,
          stock: nuevoStock,
          idCategoria: prod.categoria
        })
      });
    }

    mostrarToast("✅ El stock fue actualizado correctamente.", "success");
    generarPDFPedido(seleccion);
    document.getElementById("pedidoEditable").style.display = "none";
    await cargarProductosDesdeBD();
  } catch (error) {
    console.error("Error al confirmar pedido:", error);
    mostrarToast("Error al actualizar el stock.", "error");
  }
}

// 🧾 Generar PDF
function generarPDFPedido(seleccion) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const fecha = new Date().toLocaleDateString("es-AR");

  doc.setFillColor(230, 230, 250);
  doc.rect(0, 0, 210, 35, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("ALMAMIA - Pedido Automático", 105, 20, { align: "center" });
  doc.setFontSize(12);
  doc.text(`Fecha de generación: ${fecha}`, 105, 28, { align: "center" });

  let y = 50;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setFillColor(200, 200, 200);
  doc.rect(15, y - 8, 180, 10, "F");
  doc.text("Producto", 25, y - 1);
  doc.text("Stock", 120, y - 1);
  doc.text("A Pedir", 170, y - 1);

  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  let alternar = false;

  seleccion.forEach(p => {
    if (alternar) {
      doc.setFillColor(245, 245, 245);
      doc.rect(15, y - 6, 180, 8, "F");
    }
    alternar = !alternar;
    doc.text(p.nombre, 25, y);
    doc.text(String(p.stock), 122, y);
    doc.text(String(p.cantidad), 172, y);
    y += 8;
    if (y > 260) {
      doc.addPage();
      y = 20;
      alternar = false;
    }
  });

  y += 10;
  const totalCant = seleccion.reduce((acc, p) => acc + p.cantidad, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(`Total productos solicitados: ${seleccion.length}`, 25, y);
  y += 7;
  doc.text(`Total unidades a pedir: ${totalCant}`, 25, y);

  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100);
  doc.text("Documento generado automáticamente por el sistema Almamia", 105, 285, { align: "center" });
  doc.save(`Pedido_Automatico_${fecha.replace(/\//g, "-")}.pdf`);
}

// ==================== TAB 2: BOLETAS (FACTURACIÓN) ====================

/**
 * Carga la lista de boletas generadas desde la API y las muestra en la tabla.
 */
async function cargarBoletasGeneradas() {
  const tbody = document.querySelector("#tablaBoletasGeneradas tbody");
  tbody.innerHTML = '<tr><td colspan="7">Cargando...</td></tr>';

  try {
    const resp = await fetch(`${API_BASE}/boletas`);
    if (!resp.ok) throw new Error("Error al cargar boletas");
    const boletas = await resp.json();

    tbody.innerHTML = ""; // Limpiar tabla

    if (boletas.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7">No hay boletas generadas.</td></tr>';
      return;
    }

    // Ordenar de más nueva a más vieja (por idBoleta)
    boletas.sort((a, b) => b.idBoleta - a.idBoleta);

    boletas.forEach(boleta => {
      // Manejo defensivo por si pedido o usuario son nulos
      const cliente = boleta.pedido?.usuario;
      const nombreCliente = cliente ? `${cliente.nombre} ${cliente.apellido ?? ''}` : "N/A";
      const nroPedido = boleta.pedido?.nroPedido ?? 0;

      const fila = `
        <tr>
          <td>${boleta.idBoleta}</td>
          <td>${nroPedido}</td>
          <td>${nombreCliente}</td>
          <td>${boleta.fechaEmision}</td>
          <td>$${boleta.total.toFixed(2)}</td>
          <td>${boleta.estado}</td>
          <td>
            <button class="btn btn-sm btn-info" onclick="verDetalleBoleta(${nroPedido})">
              Ver 👁️
            </button>
          </td>
        </tr>
      `;
      tbody.insertAdjacentHTML("beforeend", fila);
    });

  } catch (error) {
    console.error("Error en cargarBoletasGeneradas:", error);
    tbody.innerHTML = `<tr><td colspan="7">Error al cargar la información.</td></tr>`;
  }
}

/**
 * Busca los detalles completos de una boleta/pedido y los muestra en un modal.
 * @param {number} nroPedido - El número de pedido para buscar la boleta.
 */
async function verDetalleBoleta(nroPedido) {
  if (nroPedido === 0) {
      mostrarToast("Error: No se puede mostrar el detalle (Pedido no vinculado)", "error");
      return;
  }

  const modalBody = document.getElementById("cuerpoModalBoleta");
  modalBody.innerHTML = "<p>Cargando detalles...</p>";

  const modal = new bootstrap.Modal(document.getElementById("modalBoletaDetalle"));
  modal.show();

  try {
    const resp = await fetch(`${API_BASE}/boletas/pedido/${nroPedido}`);
    if (!resp.ok) throw new Error("Boleta no encontrada");

    const data = await resp.json();
    const { boleta, pedido, usuario, detalles } = data;

    // Formatear detalles en una tabla
    let detallesHtml = '<table class="table table-sm table-bordered"><thead><tr><th>Producto</th><th>Cant.</th><th>P. Unit.</th><th>Subtotal</th></tr></thead><tbody>';
    detalles.forEach(d => {
      detallesHtml += `
        <tr>
          <td>${d.producto.nombre}</td>
          <td>${d.cantidad}</td>
          <td>$${d.precioUnitario.toFixed(2)}</td>
          <td>$${(d.cantidad * d.precioUnitario).toFixed(2)}</td>
        </tr>
      `;
    });
    detallesHtml += '</tbody></table>';

    // Construir HTML del modal
    modalBody.innerHTML = `
      <div class="row">
        <div class="col-md-6">
          <h5>Datos del Cliente</h5>
          <p><strong>Nombre:</strong> ${usuario.nombre} ${usuario.apellido ?? ''}</p>
          <p><strong>Email:</strong> ${usuario.email}</p>
          <p><strong>Teléfono:</strong> ${usuario.telefono ?? '-'}</p>
        </div>
        <div class="col-md-6">
          <h5>Datos de la Boleta</h5>
          <p><strong>Nro. Boleta:</strong> ${boleta.idBoleta}</p>
          <p><strong>Nro. Pedido:</strong> ${pedido.nroPedido}</p>
          <p><strong>Fecha Emisión:</strong> ${boleta.fechaEmision}</p>
          <p><strong>Estado:</strong> ${boleta.estado}</p>
        </div>
      </div>

      <hr>
      <h5>Detalle del Pedido</h5>
      ${detallesHtml}

      <hr>
      <div class="text-end">
        <h5 class="mb-1">Subtotal: $${boleta.subtotal.toFixed(2)}</h5>
        <h5 class="mb-1">IVA (19%): $${boleta.iva.toFixed(2)}</h5>
        <h4 class="mb-0"><strong>Total: $${boleta.total.toFixed(2)}</strong></h4>
      </div>
    `;

  } catch (error) {
    console.error("Error en verDetalleBoleta:", error);
    modalBody.innerHTML = `<p class="text-danger">Error al cargar los detalles: ${error.message}</p>`;
  }
}

// ==================== TAB 3: USUARIOS ====================

async function cargarUsuarios() {
  const tbody = document.querySelector("#tablaUsuarios tbody");
  tbody.innerHTML = '<tr><td colspan="8">Cargando...</td></tr>';

  try {
    const resp = await fetch(`${API_BASE}/usuarios`);
    if (!resp.ok) throw new Error("Error al cargar usuarios");
    const data = await resp.json();
    const usuarios = Object.values(data);

    tbody.innerHTML = ""; // Limpiar tabla

    if (usuarios.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8">No hay usuarios registrados</td></tr>`;
      return;
    }

    usuarios.forEach(u => {
      const rolNombre =
        u.rol === 1 ? "Administrador" :
        u.rol === 2 ? "Revendedor" : "Usuario";

      const fila = `
        <tr>
          <td>${u.idUsuario}</td>
          <td>${u.nombre} ${u.apellido ?? ""}</td>
          <td>${u.email}</td>
          <td>${u.telefono ?? "-"}</td>
          <td>${rolNombre}</td>
          <td>${u.fechaAlta ?? "-"}</td>
          <td>${u.activo ? "Activo ✅" : "Inactivo ❌"}</td>
          <td>
            <button class="btn btn-sm btn-primary me-1" onclick="editarUsuario(${u.idUsuario})">✏️</button>
            <button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${u.idUsuario})">🗑️</button>
          </td>
        </tr>`;
      tbody.insertAdjacentHTML("beforeend", fila);
    });
  } catch (error) {
    console.error("Error en cargarUsuarios:", error);
    tbody.innerHTML = `<tr><td colspan="8" class="text-danger">Error al cargar usuarios</td></tr>`;
  }
}

// Abrir modal
function abrirModalUsuario(usuario = null) {
  const modal = new bootstrap.Modal(document.getElementById("modalUsuario"));
  document.getElementById("formUsuario").reset();

  document.getElementById("modalUsuarioLabel").textContent = usuario ? "Editar Usuario" : "Nuevo Usuario";
  if (usuario) {
    document.getElementById("usuarioId").value = usuario.idUsuario;
    document.getElementById("nombreUsuario").value = usuario.nombre;
    document.getElementById("apellidoUsuario").value = usuario.apellido;
    document.getElementById("emailUsuario").value = usuario.email;
    document.getElementById("telefonoUsuario").value = usuario.telefono ?? "";
    document.getElementById("rolUsuario").value = usuario.rol;
    document.getElementById("activoUsuario").value = usuario.activo ?? 1;
  }

  modal.show();
}

// Editar usuario existente
async function editarUsuario(id) {
  try {
    const resp = await fetch(`${API_BASE}/usuarios/${id}`);
    if (!resp.ok) throw new Error("Usuario no encontrado");
    const usuario = await resp.json();
    abrirModalUsuario(usuario);
  } catch (error) {
    console.error("Error al editar usuario:", error);
    mostrarToast("Error al cargar datos del usuario.", "error");
  }
}

// Guardar usuario
async function guardarUsuario(event) {
  event.preventDefault();

  const id = document.getElementById("usuarioId").value;
  const usuario = {
    idUsuario: id || null,
    nombre: document.getElementById("nombreUsuario").value,
    apellido: document.getElementById("apellidoUsuario").value,
    email: document.getElementById("emailUsuario").value,
    telefono: document.getElementById("telefonoUsuario").value,
    rol: Number(document.getElementById("rolUsuario").value),
    activo: Number(document.getElementById("activoUsuario").value)
  };

  const metodo = id ? "PUT" : "POST";
  const url = id ? `${API_BASE}/usuarios/${id}` : `${API_BASE}/usuarios/registrar`; // Asumiendo /registrar para nuevos

  try {
    const resp = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario)
    });

    if (!resp.ok) throw new Error("Error al guardar");

    mostrarToast("✅ Usuario guardado correctamente.", "success");
    bootstrap.Modal.getInstance(document.getElementById("modalUsuario")).hide();
    await cargarUsuarios(); // Recargar la lista de usuarios
  } catch (error) {
    console.error("Error al guardar usuario:", error);
    mostrarToast("Error al guardar el usuario.", "error");
  }
}

// Eliminar usuario
async function eliminarUsuario(id) {
  if (!confirm("¿Seguro que desea eliminar este usuario?")) return;

  try {
    const resp = await fetch(`${API_BASE}/usuarios/${id}`, { method: "DELETE" });
    if (!resp.ok) throw new Error("Error al eliminar");

    mostrarToast("🗑️ Usuario eliminado correctamente.", "warning");
    await cargarUsuarios(); // Recargar la lista
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    mostrarToast("Error al eliminar el usuario.", "error");
  }
}


// ==================== UTILIDADES ====================

// ========== Toast de Bootstrap ==========
function mostrarToast(mensaje, tipo = "info") {
  const toastEl = document.getElementById("liveToast");
  const toastHeader = document.getElementById("toastHeader");
  const toastMessage = document.getElementById("toastMessage");

  toastHeader.className = "toast-header text-white";
  switch (tipo) {
    case "success":
      toastHeader.classList.add("bg-success");
      break;
    case "error":
      toastHeader.classList.add("bg-danger");
      break;
    case "warning":
      toastHeader.classList.add("bg-warning", "text-dark");
      break;
    default:
      toastHeader.classList.add("bg-primary");
  }

  toastMessage.textContent = mensaje;
  new bootstrap.Toast(toastEl, { delay: 3000 }).show();
}
