// devoluciones.js
document.addEventListener("DOMContentLoaded", () => {
  const idUsuario = localStorage.getItem("id_usuario") || 1;
  const selectPedidos = document.createElement("select");
  selectPedidos.className = "form-select selectPedido";
  selectPedidos.innerHTML = `<option value="">Cargando pedidos...</option>`;

  const tablaDevolucionBody = document.querySelector("#tablaDevolucion tbody");
  const btnAgregar = document.getElementById("agregarFilaDevolucion");
  const formDevolucion = document.getElementById("formDevolucion");

  // Modal simple de confirmación (usa bootstrap modal existente o crea uno dinamicamente)
  function crearModalConfirmacion() {
    // Si ya existe no la duplicamos
    if (document.getElementById("modalConfirmDevolucion")) return;

    const modalHtml = `
      <div class="modal fade" id="modalConfirmDevolucion" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Confirmar Devolución</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <p>Vas a devolver el/los pedido(s) seleccionado(s). Esto devolverá <strong>todo</strong> el contenido del pedido al stock.</p>
              <ul id="listaPedidosConfirm"></ul>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" id="confirmarDevolucionBtn" class="btn btn-warning">Confirmar Devolución</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHtml);
  }

  crearModalConfirmacion();

  // Cargar pedidos del usuario para el select
  async function cargarPedidosUsuario() {
    try {
      const resp = await fetch(`http://localhost:8080/pedidos/usuario/${idUsuario}`);
      if (!resp.ok) throw new Error("Error al traer pedidos");
      const pedidos = await resp.json();

      if (!Array.isArray(pedidos) || pedidos.length === 0) {
        selectPedidos.innerHTML = `<option value="">No hay pedidos</option>`;
        return;
      }

      selectPedidos.innerHTML = `<option value="">Seleccione un pedido</option>`;
      pedidos.forEach(p => {
        // mostramos nroPedido + fecha para identificar
        const label = `${p.nroPedido} - ${p.fecha ?? ""}`;
        const opt = document.createElement("option");
        opt.value = p.nroPedido;
        opt.textContent = label;
        selectPedidos.appendChild(opt);
      });
    } catch (err) {
      console.error("Error cargando pedidos:", err);
      selectPedidos.innerHTML = `<option value="">Error cargando pedidos</option>`;
    }
  }

  // Inserto el select dentro del área del botón (si vas a mantener diseño, solo necesito que exista)
  // Buscamos el contenedor y colocamos el select antes del botón Agregar Pedido
  const contenedorAgregar = document.querySelector("#agregarFilaDevolucion").parentElement;
  // evitar duplicados
  if (!contenedorAgregar.querySelector(".selectPedido")) {
    contenedorAgregar.insertBefore(selectPedidos, document.getElementById("agregarFilaDevolucion"));
  }

  cargarPedidosUsuario();

  // Manejar Agregar Pedido (agrega fila con nroPedido)
  btnAgregar.addEventListener("click", () => {
    const nro = selectPedidos.value;
    if (!nro) {
      alert("Seleccione un pedido para agregar.");
      return;
    }

    // evitar duplicados en la tabla
    const existente = Array.from(tablaDevolucionBody.querySelectorAll("tr td:first-child"))
      .some(td => td.textContent.trim() === nro.toString());
    if (existente) {
      alert("Ese pedido ya fue agregado.");
      return;
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="nroPedidoCell">${nro}</td>
      <td><button type="button" class="btn btn-danger btn-sm eliminarDevolucion">X</button></td>
    `;
    tablaDevolucionBody.appendChild(tr);
  });

  // Eliminar fila
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("eliminarDevolucion")) {
      e.target.closest("tr").remove();
    }
  });

  // Submit del formulario (abrir modal de confirmación)
  formDevolucion.addEventListener("submit", (e) => {
    e.preventDefault();
    const filas = Array.from(tablaDevolucionBody.querySelectorAll("tr"));
    if (filas.length === 0) {
      alert("Agregá al menos un pedido para devolver.");
      return;
    }

    const pedidosSeleccionados = filas.map(tr => tr.querySelector(".nroPedidoCell").textContent.trim());

    // llenar modal
    const lista = document.getElementById("listaPedidosConfirm");
    lista.innerHTML = "";
    pedidosSeleccionados.forEach(n => {
      const li = document.createElement("li");
      li.textContent = `Pedido ${n}`;
      lista.appendChild(li);
    });

    // mostrar modal
    const modalEl = document.getElementById("modalConfirmDevolucion");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    // manejar confirmación
    const btnConfirm = document.getElementById("confirmarDevolucionBtn");
    // quitamos listeners previos si existen
    btnConfirm.replaceWith(btnConfirm.cloneNode(true));
    const nuevoBtnConfirm = document.getElementById("confirmarDevolucionBtn");
    nuevoBtnConfirm.addEventListener("click", async () => {
      await enviarDevolucion(pedidosSeleccionados);
      modal.hide();
    });
  });

  // Enviar la devolución al backend
  async function enviarDevolucion(pedidosArray) {
    try {
      const payload = {
        pedidos: pedidosArray.map(n => Number(n)),
        idUsuario: Number(idUsuario)
      };

      const resp = await fetch("http://localhost:8080/devoluciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || "Error al crear devolución");
      }

      const data = await resp.json();
      alert("Devolución registrada correctamente.");
      // limpiar tabla
      tablaDevolucionBody.innerHTML = "";
      // recargar select de pedidos por si cambió algo
      cargarPedidosUsuario();
    } catch (err) {
      console.error("Error enviando devolución:", err);
      alert("Error al generar la devolución: " + (err.message || err));
    }
  }
});
