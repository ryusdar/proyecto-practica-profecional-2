document.addEventListener("DOMContentLoaded", async () => {
  const tablaPedido = document.querySelector("#tablaPedido tbody");
  const btnAgregar = document.getElementById("agregarFila");
  const btnEnviar = document.getElementById("pedido");
  const totalGeneral = document.getElementById("totalGeneral");
  const idUsuario = localStorage.getItem("id_usuario") || 1;

  const tablaConfirmacion = document.getElementById("tablaConfirmacion");
  const totalConfirmacion = document.getElementById("totalConfirmacion");
  const btnConfirmar = document.getElementById("confirmarPedido");

  let productos = [];
  let detallesTemporales = [];

  // CARGA DESDE PRODUCTOS
  try {
    const response = await fetch("http://localhost:8080/productos");
    productos = await response.json();
    actualizarSelects();
  } catch (err) {
    console.error("No se pudieron cargar los productos:", err);
    alert("Error al cargar productos. Revisa el servidor.");
    return;
  }

  // PRODUCTOS A LISTA
  function actualizarSelects() {
    document.querySelectorAll("select.producto").forEach(select => {
      select.innerHTML = '<option value="">Seleccione un producto</option>';
      productos.forEach(p => {
        select.innerHTML += `<option value="${p.idProducto}" data-precio="${p.precio}">${p.nombre}</option>`;
      });
    });
  }

  // AGREGAR FILA
  btnAgregar.addEventListener("click", () => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>
        <select class="form-select producto"></select>
      </td>
      <td><input type="number" class="form-control cantidad" value="1" min="1"></td>
      <td><input type="number" class="form-control precio" value="0" readonly></td>
      <td class="total">0.00</td>
      <td><button type="button" class="btn btn-danger btn-sm eliminar">X</button></td>
    `;
    tablaPedido.appendChild(fila);
    actualizarSelects();
  });

  // FUNCION PARA ACTUALIZAR SOLO EL SELECT NUEVO
  function actualizarSelect(fila) {
    const select = fila.querySelector("select.producto");
    select.innerHTML = '<option value="">Seleccione un producto</option>';
    productos.forEach(p => {
      select.innerHTML += `<option value="${p.idProducto}" data-precio="${p.precio}">${p.nombre}</option>`;
    });
  }

  // Añadimos una fila inicial si no hay
  if (tablaPedido.children.length === 0) btnAgregar.click();

  // TABLA - eventos
  tablaPedido.addEventListener("input", e => {
    if (e.target.classList.contains("cantidad")) {
      recalcularFila(e.target.closest("tr"));
    }
  });

  tablaPedido.addEventListener("change", e => {
    if (e.target.classList.contains("producto")) {
      const option = e.target.selectedOptions[0];
      const precio = parseFloat(option.getAttribute("data-precio")) || 0;
      const fila = e.target.closest("tr");
      fila.querySelector(".precio").value = precio.toFixed(2);
      recalcularFila(fila);
    }
  });

  tablaPedido.addEventListener("click", e => {
    if (e.target.classList.contains("eliminar")) {
      e.target.closest("tr").remove();
      recalcularTotalGeneral();
    }
  });

  // CALCULOS
  function recalcularFila(fila) {
    const cantidad = parseInt(fila.querySelector(".cantidad").value) || 0;
    const precio = parseFloat(fila.querySelector(".precio").value) || 0;
    const total = cantidad * precio;
    fila.querySelector(".total").textContent = total.toFixed(2);
    recalcularTotalGeneral();
  }

  function recalcularTotalGeneral() {
    let total = 0;
    document.querySelectorAll("#tablaPedido tbody tr .total").forEach(td => {
      total += parseFloat(td.textContent) || 0;
    });
    totalGeneral.textContent = total.toFixed(2);
  }

  // VISTA PREVIA
  btnEnviar.addEventListener("click", () => {
    const filas = document.querySelectorAll("#tablaPedido tbody tr");
    detallesTemporales = [];
    let total = 0;
    tablaConfirmacion.innerHTML = "";

    filas.forEach(fila => {
      const idProducto = parseInt(fila.querySelector(".producto").value);
      const cantidad = parseInt(fila.querySelector(".cantidad").value);
      const precio = parseFloat(fila.querySelector(".precio").value);
      const productoObj = productos.find(p => p.idProducto === idProducto);

      if (idProducto && cantidad > 0 && productoObj) {
        const subtotal = cantidad * precio;
        total += subtotal;

        detallesTemporales.push({ idProducto, cantidad, precio });

        tablaConfirmacion.innerHTML += `
          <tr>
            <td>${productoObj.nombre}</td>
            <td>${cantidad}</td>
            <td>${precio.toFixed(2)}</td>
            <td>${subtotal.toFixed(2)}</td>
          </tr>`;
      }
    });

    if (detallesTemporales.length === 0) {
      alert("⚠️ Debes agregar al menos un producto.");
      return;
    }

    totalConfirmacion.textContent = total.toFixed(2);
    new bootstrap.Modal(document.getElementById("confirmarModal")).show();
  });

  // CONFIRMACION PEDIDO
  btnConfirmar.addEventListener("click", async () => {
    const pedido = { idUsuario: parseInt(idUsuario), detalles: detallesTemporales };

    try {
      const response = await fetch("http://localhost:8080/pedidos/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`✅ ${data.mensaje}\nNúmero de pedido: ${data.nroPedido}`);

        // Limpiar la tabla de pedido
        tablaPedido.innerHTML = "";
        recalcularTotalGeneral();
        btnAgregar.click();
        bootstrap.Modal.getInstance(document.getElementById("confirmarModal")).hide();

        // Abrir revendedores.html en nueva pestaña y pasar el nroPedido para que lo muestre/hightlightee
        if (data.nroPedido) {
          
        }
      } else {
        const errorText = await response.text();
        alert("❌ Error al registrar pedido: " + errorText);
      }
    } catch (error) {
      console.error("Error al enviar pedido:", error);
      alert("❌ Error de conexión con el servidor.");
    }
  });

});
