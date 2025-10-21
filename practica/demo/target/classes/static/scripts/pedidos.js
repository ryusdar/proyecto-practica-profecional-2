$(document).ready(function () {
  console.log("DOM cargado");
  console.log("Botón encontrado:", $("#pedido").length);

  let preciosProductos = {}; // Se llenará desde la BD

  // 🔹 1. Cargar productos desde la base de datos
  async function cargarProductos() {
    try {
      const response = await fetch("/api/producto"); // <-- endpoint del backend
      if (!response.ok) throw new Error("Error al obtener productos");

      const productos = await response.json();

      // Guardamos los precios en el objeto
      productos.forEach(p => {
        preciosProductos[p.nombre] = p.precio;
      });

      console.log("Productos cargados:", preciosProductos);
    } catch (error) {
      console.error("❌ Error al cargar productos:", error);
      alert("No se pudieron cargar los productos desde la base de datos");
    }
  }

  // 🔹 2. Inicializar Select2
  function inicializarSelect2() {
    $(".producto").select2({
      placeholder: "Buscar producto...",
      allowClear: true,
      width: "100%",
    });
  }

  // 🔹 3. Calcular totales
  function actualizarTotales() {
    let totalGeneral = 0;
    $("#tablaPedido tbody tr").each(function () {
      const cantidad = parseFloat($(this).find(".cantidad").val()) || 0;
      const precio = parseFloat($(this).find(".precio").val()) || 0;
      const total = cantidad * precio;
      $(this).find(".total").text(total.toFixed(2));
      totalGeneral += total;
    });
    $("#totalGeneral").text(totalGeneral.toFixed(2));
  }

  // 🔹 4. Cuando cambia un producto
  $(document).on("change", ".producto", function () {
    const producto = $(this).val();
    const precio = preciosProductos[producto] || 0;
    $(this).closest("tr").find(".precio").val(precio.toFixed(2));
    actualizarTotales();
  });

  // 🔹 5. Cuando cambia la cantidad
  $(document).on("input", ".cantidad", function () {
    actualizarTotales();
  });

  // 🔹 6. Agregar fila dinámicamente
  $("#agregarFila").on("click", async function () {
    try {
      // Aseguramos que los productos estén cargados antes de crear la fila
      if (Object.keys(preciosProductos).length === 0) {
        await cargarProductos();
      }

      let opciones = `<option value="">Seleccione un producto</option>`;
      for (const nombre in preciosProductos) {
        opciones += `<option value="${nombre}">${nombre}</option>`;
      }

      const nuevaFila = `
        <tr>
          <td>
            <select class="form-select producto">
              ${opciones}
            </select>
          </td>
          <td><input type="number" class="form-control cantidad" value="1" min="1"></td>
          <td><input type="number" class="form-control precio" value="0" readonly></td>
          <td class="total">0.00</td>
          <td><button type="button" class="btn btn-danger btn-sm eliminar">X</button></td>
        </tr>`;
      $("#tablaPedido tbody").append(nuevaFila);
      inicializarSelect2();
    } catch (err) {
      console.error("Error al agregar fila:", err);
    }
  });

  // 🔹 7. Eliminar fila
  $(document).on("click", ".eliminar", function () {
    $(this).closest("tr").remove();
    actualizarTotales();
  });

  // 🔹 8. Enviar pedido al servidor
  $("#pedido").on("click", async function (e) {
    e.preventDefault();

    let items = [];
    $("#tablaPedido tbody tr").each(function () {
      const producto = $(this).find(".producto").val();
      const cantidad = parseInt($(this).find(".cantidad").val()) || 0;
      const precio = parseFloat($(this).find(".precio").val()) || 0;
      if (producto && cantidad > 0) {
        items.push({
          nombreProducto: producto,
          cantidad: cantidad,
          precioUnitario: precio
        });
      }
    });

    if (items.length === 0) {
      alert("⚠️ No hay productos en el pedido");
      return;
    }

    const pedido = { productos: items };

    try {
      const response = await fetch("/api/pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido),
      });

      if (response.ok) {
        alert("✅ Pedido guardado correctamente en la base de datos");
        $("#tablaPedido tbody").empty();
        actualizarTotales();
      } else {
        alert("⚠️ Error al guardar el pedido");
        console.log(await response.text());
      }
    } catch (error) {
      console.error("Error al enviar pedido:", error);
      alert("❌ Error de conexión con el servidor");
    }
  });

  // 🔹 9. Inicialización general
  (async function init() {
    await cargarProductos();
    inicializarSelect2();
    actualizarTotales();
  })();
});
