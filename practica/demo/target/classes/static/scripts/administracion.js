// Control de stock
    $("#pedidoAuto").on("click", function () {
        let pedidos = [];
        $("#tablaStock tbody tr").each(function () {
            const insumo = $(this).find("td:first").text();
            const stock = parseInt($(this).find(".stock").text());
            const reposicion = parseInt($(this).find("td:nth-child(3)").text());
            if (stock < reposicion) pedidos.push(insumo);
        });
        if (pedidos.length > 0) alert("Se generó un pedido automático para: " + pedidos.join(", "));
        else alert("Todos los insumos tienen stock suficiente ✅");
    });

  function filtrarStock() {
    const insumoFilter = $("#filterInsumo").val().toLowerCase();
    const min = parseInt($("#filterCantidadMin").val()) || Number.NEGATIVE_INFINITY;
    const max = parseInt($("#filterCantidadMax").val()) || Number.POSITIVE_INFINITY;

    $("#tablaStock tbody tr").each(function () {
        const insumo = $(this).find("td:first").text().toLowerCase();
        const cantidad = parseInt($(this).find(".stock").text()) || 0;
        const matchInsumo = insumo.includes(insumoFilter);
        const matchCantidad = cantidad >= min && cantidad <= max;
        $(this).toggle(matchInsumo && matchCantidad);
    });
}

$("#filterInsumo").on("input", filtrarStock);
$("#filterCantidadMin, #filterCantidadMax").on("input", filtrarStock);

    // Facturación
    const precios = { "Shampoo Sólido": 2500, Acondicionador: 2700, "Jabón Natural": 1800 };

    function actualizarTotales() {
        let granTotal = 0;
        $("#tablaFactura tbody tr").each(function () {
            const cantidad = parseFloat($(this).find(".cantidad").val()) || 0;
            const precio = parseFloat($(this).find(".precio").val()) || 0;
            const total = cantidad * precio;
            $(this).find(".total").text(total.toFixed(2));
            granTotal += total;
        });
        $("#granTotal").text(granTotal.toFixed(2));
    }

    function actualizarPrecio(sel) {
        const val = sel.value;
        const precio = precios[val] || 0;
        $(sel).closest("tr").find(".precio").val(precio.toFixed(2));
        actualizarTotales();
    }

    $(document).on("input", ".cantidad", actualizarTotales);

    $("#agregarFila").on("click", function () {
        const fila = `
        <tr>
          <td>
            <select class="form-select producto" onchange="actualizarPrecio(this)">
              <option value="">Seleccione producto...</option>
              <option value="Shampoo Sólido">Shampoo Sólido</option>
              <option value="Acondicionador">Acondicionador</option>
              <option value="Jabón Natural">Jabón Natural</option>
            </select>
          </td>
          <td><input type="number" class="form-control cantidad" value="1" min="1" /></td>
          <td><input type="number" class="form-control precio text-center" value="0" min="0" step="0.01" readonly /></td>
          <td class="total">0.00</td>
          <td><button type="button" class="btn btn-danger btn-sm eliminar">X</button></td>
        </tr>`;
        $("#tablaFactura tbody").append(fila);
    });

    $(document).on("click", ".eliminar", function () {
        $(this).closest("tr").remove();
        actualizarTotales();
    });

    $("#formFactura").on("submit", function (e) {
        e.preventDefault();
        alert("Boleta generada correctamente ✅");
    });

    document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("usuario");
    window.location.href = "../index.html";
});
