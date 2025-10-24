$(document).ready(function () {
    // Agregar nueva fila en devoluciones
    $("#agregarFilaDevolucion").on("click", function () {
        const nuevaFila = `
        <tr>
            <td>
                <select class="form-select productoDevolucion">
                    <option value="">Seleccione un producto</option>
                </select>
            </td>
            <td><input type="number" class="form-control cantidadDevolucion" min="1" value="1"></td>
            <td><button type="button" class="btn btn-danger btn-sm eliminarDevolucion">X</button></td>
        </tr>`;
        $("#tablaDevolucion tbody").append(nuevaFila);
    });

    // Eliminar fila
    $(document).on("click", ".eliminarDevolucion", function () {
        $(this).closest("tr").remove();
    });

    // Capturar formulario de devoluciones
    $("#formDevolucion").on("submit", function (e) {
        e.preventDefault();
        const devoluciones = [];

        $("#tablaDevolucion tbody tr").each(function () {
            const producto = $(this).find(".productoDevolucion").val();
            const cantidad = parseInt($(this).find(".cantidadDevolucion").val()) || 0;
            if (producto && cantidad > 0) {
                devoluciones.push({ producto, cantidad });
            }
        });

        if (devoluciones.length === 0) {
            alert("Debe seleccionar al menos un producto para la devolución.");
            return;
        }

        console.log("Productos a devolver:", devoluciones);
        alert("Pedido de devolución generado ✅");

        $("#tablaDevolucion tbody").html('');
    });
});
