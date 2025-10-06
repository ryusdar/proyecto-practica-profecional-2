const preciosProductos = {
  "Shampoo Sólido": 2500,
  "Acondicionador": 2700,
  "Jabón Natural": 1800,
  "Crema Corporal": 3200,
  "Perfume Vegano": 4100,
};

// Inicializar Select2
function inicializarSelect2() {
  $(".producto").select2({
    placeholder: "Buscar producto...",
    allowClear: true,
    width: "100%",
  });
}

// Actualizar totales individuales y total general
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

// Cambio de producto
$(document).on("change", ".producto", function () {
  const producto = $(this).val();
  const precio = preciosProductos[producto] || 0;
  $(this).closest("tr").find(".precio").val(precio.toFixed(2));
  actualizarTotales();
});

// Cambio de cantidad
$(document).on("input", ".cantidad", function () {
  actualizarTotales();
});

// Agregar fila
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

// Eliminar fila
$(document).on("click", ".eliminar", function () {
  $(this).closest("tr").remove();
  actualizarTotales();
});

// Guardar pedido
$("#guardarPedido").on("click", function () {
  alert("Pedido guardado correctamente ✅");
});

// Inicializar Select2 al cargar
$(document).ready(function () {
  inicializarSelect2();
  actualizarTotales();
});
