document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const clave = document.getElementById("clave").value.trim();

    if (!usuario || !clave) {
      mostrarToast("Por favor ingrese usuario y contraseña.", "warning");
      return;
    }

    const response = await fetch("http://localhost:8080/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: usuario, contraseña: clave })
    });

    if (!response.ok) {
      mostrarToast("Usuario o contraseña incorrectos", "error");
      return;
    }

    const data = await response.json();

    // Guardamos el usuario en localStorage
    localStorage.setItem("usuario", JSON.stringify(data));

    mostrarToast(`Bienvenido ${data.nombre} (${data.rol == 1 ? "Administrador" : "Revendedor"})`, "success");

    // Pequeño retardo para que se vea el toast
    setTimeout(() => {
      if (data.rol == 1) {
        window.location.href = "dist/administracion.html";
      } else {
        window.location.href = "dist/revendedores.html";
      }
    }, 1500);
  });
});

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
