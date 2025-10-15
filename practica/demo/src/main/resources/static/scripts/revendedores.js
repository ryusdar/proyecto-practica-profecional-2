    $(document).on("click", ".pagar", function () {
        const pedido = $(this).data("pedido");
        window.location.href = `pagos.html?pedido=${pedido}`;
    });

    document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("usuario");
    window.location.href = "../index.html";
});
