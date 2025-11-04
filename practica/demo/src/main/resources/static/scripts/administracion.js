const API_BASE = "http://localhost:8080";
const UMBRAL_STOCK_BAJO = 5;
const STOCK_OBJETIVO = 10;

let productos = [];

// ==================== STOCK ====================

document.addEventListener("DOMContentLoaded", async () => {
  await cargarProductosDesdeBD();
  document.getElementById("filterInsumo").addEventListener("input", filtrarProductos);
  document.getElementById("filterCantidadMin").addEventListener("input", filtrarProductos);
  document.getElementById("filterCantidadMax").addEventListener("input", filtrarProductos);
  document.getElementById("pedidoAuto").addEventListener("click", generarPedidoAutomatico);

  // Usuarios
  if (document.getElementById("usuarios-tab")) {
    await cargarUsuarios();
    document.getElementById("btnNuevoUsuario")?.addEventListener("click", () => abrirModalUsuario());
    document.getElementById("formUsuario")?.addEventListener("submit", guardarUsuario);
  }
});

// 🟢 Cargar productos desde la BD
async function cargarProductosDesdeBD() {
  const resp = await fetch(`${API_BASE}/productos`);
  const data = await resp.json();

  productos = data.map(p => ({
    id: p.idProducto,
    nombre: p.nombre,
    precio: p.precio?.parsedValue ?? 0,
    stock: Number(p.stock),
    categoria: p.idCategoria
  }));

  mostrarProductos(productos);
}

// 🧾 Mostrar productos
function mostrarProductos(lista) {
  const tbody = document.querySelector("#tablaStock tbody");
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

// ==================== USUARIOS ====================

async function cargarUsuarios() {
  const resp = await fetch(`${API_BASE}/usuarios`);
  const data = await resp.json();
  const usuarios = Object.values(data);
  const tbody = document.querySelector("#tablaUsuarios tbody");
  tbody.innerHTML = "";

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
  const resp = await fetch(`${API_BASE}/usuarios/${id}`);
  const usuario = await resp.json();
  abrirModalUsuario(usuario);
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
  const url = id ? `${API_BASE}/usuarios/${id}` : `${API_BASE}/usuarios`;

  await fetch(url, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario)
  });

  mostrarToast("✅ Usuario guardado correctamente.", "success");
  bootstrap.Modal.getInstance(document.getElementById("modalUsuario")).hide();
  await cargarUsuarios();
}

// Eliminar usuario
async function eliminarUsuario(id) {
  if (!confirm("¿Seguro que desea eliminar este usuario?")) return;
  await fetch(`${API_BASE}/usuarios/${id}`, { method: "DELETE" });
  mostrarToast("🗑️ Usuario eliminado correctamente.", "warning");
  await cargarUsuarios();
}

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

  document.addEventListener("DOMContentLoaded", () => {
    // Cargar usuario desde localStorage
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    const userButton = document.getElementById("userMenuButton");
    const nombreMenu = document.getElementById("nombreUsuarioMenu");

    if (usuario) {
      // Mostrar inicial (primera letra del nombre)
      const inicial = usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : "U";
      userButton.textContent = inicial;

      // Mostrar nombre completo en el menú
      nombreMenu.textContent = `${usuario.nombre} ${usuario.apellido ?? ""}`;
    } else {
      userButton.textContent = "?";
      nombreMenu.textContent = "Invitado";
    }

    // Cerrar sesión
    document.getElementById("logoutBtn").addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("usuario");
      mostrarToast("Sesión cerrada correctamente", "success");

      setTimeout(() => {
        window.location.href = "../index.html";
      }, 1000);
    });
  });
