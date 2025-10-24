document.addEventListener("DOMContentLoaded", async function () {
    const form = document.getElementById("formRegistro");

    // Elementos de los select
    const paisSelect = document.getElementById("pais");
    const provinciaSelect = document.getElementById("provincia");
    const localidadSelect = document.getElementById("localidad");

    // 🔹 Cargar países al iniciar
    try {
        const paisesResponse = await fetch("http://localhost:8080/paises");
        const paises = await paisesResponse.json();
        paisSelect.innerHTML = '<option value="">Seleccionar país</option>';
        paises.forEach(p => {
            const option = document.createElement("option");
            option.value = p.idPais;
            option.textContent = p.nombre;
            paisSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error cargando países:", error);
    }

    // 🔹 Cargar provincias según país seleccionado
    paisSelect.addEventListener("change", async () => {
        const idPais = paisSelect.value;
        provinciaSelect.innerHTML = '<option value="">Cargando provincias...</option>';
        localidadSelect.innerHTML = '<option value="">Seleccionar localidad</option>';

        if (!idPais) return;

        try {
            const response = await fetch(`http://localhost:8080/registro/provincias/${idPais}`);
            const provincias = await response.json();
            provinciaSelect.innerHTML = '<option value="">Seleccionar provincia</option>';
            provincias.forEach(p => {
                const option = document.createElement("option");
                option.value = p.idProvincia;
                option.textContent = p.nombre;
                provinciaSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error cargando provincias:", error);
        }
    });

    // 🔹 Cargar localidades según provincia seleccionada
    provinciaSelect.addEventListener("change", async () => {
        const idProvincia = provinciaSelect.value;
        localidadSelect.innerHTML = '<option value="">Cargando localidades...</option>';

        if (!idProvincia) return;

        try {
            const response = await fetch(`http://localhost:8080/registro/localidades/${idProvincia}`);
            const localidades = await response.json();
            localidadSelect.innerHTML = '<option value="">Seleccionar localidad</option>';
            localidades.forEach(l => {
                const option = document.createElement("option");
                option.value = l.idLocalidad;
                option.textContent = l.nombre;
                localidadSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error cargando localidades:", error);
        }
    });

    // 🔹 Envío del formulario
    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        console.log("🟢 Enviando formulario...");

        // Capturar valores
        const nombre = document.getElementById("nombre").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        const email = document.getElementById("email").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const clave = document.getElementById("clave").value.trim();
        const calle = document.getElementById("calle").value.trim();
        const numero = parseInt(document.getElementById("numero").value.trim());
        const idLocalidad = parseInt(localidadSelect.value);

        // Validación
        if (!nombre || !apellido || !email || !telefono || !clave || !calle || !numero || !idLocalidad) {
            alert("Por favor complete todos los campos.");
            return;
        }

        // Crear objeto Usuario con estructura anidada para Hibernate
        const usuario = {
            nombre,
            apellido,
            email,
            telefono,
            contraseña: clave,
            activo: 1,
            domicilio: {
                calle,
                numero,
                localidad: {
                    idLocalidad
                }
            }
        };

        console.log("📤 Datos enviados al backend:", usuario);

        try {
            const response = await fetch("http://localhost:8080/usuarios/registrar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(usuario)
            });

            if (response.ok) {
                const data = await response.json();
                console.log("✅ Respuesta del backend:", data);
                alert("Usuario registrado correctamente.");
                form.reset();
                window.location.href = "/index.html";
            } else {
                const error = await response.text();
                console.error("❌ Error del backend:", error);
                alert("Error al registrar: " + error);
            }
        } catch (error) {
            console.error("🚨 Error en la solicitud:", error);
            alert("No se pudo conectar con el servidor.");
        }
    });
});
