$(document).ready(function() {
  console.log("DOM cargado");
  console.log("Botón encontrado:", $("#pedido").length);
});

const preciosProductos = {
  "Shampoo Sólido": 2500,
  "Acondicionador": 2700,
  "Jabón Natural": 1800,
  "Crema Corporal": 3200,
  "Perfume Vegano": 4100,
};

// ⚠️ ACTUALIZA ESTOS IDs CON LOS DE TU BASE DE DATOS
// Ejecuta: SELECT id_producto, nombre FROM producto;
const productosIds = {
  "Shampoo Sólido": 1,      // Cambia estos números
  "Acondicionador": 2,       // según tu consulta SQL
  "Jabón Natural": 3,
  "Crema Corporal": 4,
  "Perfume Vegano": 5
};

function inicializarSelect2() {
  $(".producto").select2({
    placeholder: "Buscar producto...",
    allowClear: true,
    width: "100%",
  });
}

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

$(document).on("change", ".producto", function () {
  const producto = $(this).val();
  const precio = preciosProductos[producto] || 0;
  $(this).closest("tr").find(".precio").val(precio.toFixed(2));
  actualizarTotales();
});

$(document).on("input", ".cantidad", function () {
  actualizarTotales();
});

$("#agregarFila").on("click", function () {
  const nuevaFila = `
    <tr>
      <td>
        <select class="form-select producto">
          <option value="">Seleccione un producto</option>
          <option value="Shampoo Sólido">Shampoo Sólido</option>
          <option value="Acondicionador">Acondicionador</option>
          <option value="Jabón Natural">Jabón Natural</option>
          <option value="Crema Corporal">Crema Corporal</option>
          <option value="Perfume Vegano">Perfume Vegano</option>
        </select>
      </td>
      <td><input type="number" class="form-control cantidad" value="1" min="1"></td>
      <td><input type="number" class="form-control precio" value="0" readonly></td>
      <td class="total">0.00</td>
      <td><button type="button" class="btn btn-danger btn-sm eliminar">X</button></td>
    </tr>`;
  $("#tablaPedido tbody").append(nuevaFila);
  inicializarSelect2();
});

$(document).on("click", ".eliminar", function () {
  $(this).closest("tr").remove();
  actualizarTotales();
});

// ✅ CÓDIGO CORREGIDO PARA ENVIAR PEDIDOS
$("#pedido").on("click", async function (e) {
  e.preventDefault();

  // Recopilar productos de la tabla
  let items = [];
  $("#tablaPedido tbody tr").each(function () {
    const nombreProducto = $(this).find(".producto").val();
    const cantidad = parseInt($(this).find(".cantidad").val()) || 0;

    if (nombreProducto && cantidad > 0) {
      const idProducto = productosIds[nombreProducto];

      // Validar que el producto tenga un ID válido
      if (!idProducto) {
        console.error("Producto sin ID:", nombreProducto);
        return;
      }

      items.push({
        nombreProducto: nombreProducto,
        cantidad: cantidad,
        idProducto: idProducto
      });
    }
  });

  if (items.length === 0) {
    alert("⚠️ No hay productos en el pedido");
    return;
  }

  console.log("Items a enviar:", items); // Para debugging

  // Enviar cada producto como un pedido separado
  try {
    let errores = [];
    let exitosos = 0;

    for (const item of items) {
      const pedido = {
        fecha: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
        cantidadProducto: item.cantidad,
        producto: {
          idProducto: item.idProducto  // ✅ Esto es CRÍTICO
        },
        idRevendedor: 1  // Cambia según tu lógica
      };

      console.log("Enviando pedido:", JSON.stringify(pedido)); // Para debugging

      const response = await fetch("/api/pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error del servidor:", errorText);
        errores.push(`${item.nombreProducto}: ${errorText}`);
      } else {
        exitosos++;
      }
    }

    if (errores.length > 0) {
      alert(`⚠️ Errores:\n${errores.join('\n')}`);
    } else {
      alert(`✅ ${exitosos} pedido(s) guardado(s) correctamente`);
      $("#tablaPedido tbody").empty();
      actualizarTotales();
    }

  } catch (error) {
    console.error("Error de conexión:", error);
    alert("❌ Error de conexión con el servidor");
  }
});

$(document).ready(function () {
  inicializarSelect2();
  actualizarTotales();
});
