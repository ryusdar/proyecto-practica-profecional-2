    $(document).on("click", ".pagar", function () {
        const pedido = $(this).data("pedido");
        window.location.href = `pagos.html?pedido=${pedido}`;
    });
