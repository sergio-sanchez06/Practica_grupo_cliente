/**
 * LÓGICA DEL FORMULARIO: Diagnóstico de Sistemas (Ampliación RA6)
 * Incluye: Manipulación de DOM, Gestión de Eventos y Objeto Event
 */

window.addEventListener("load", () => {
  const formulario = document.getElementById("form-autoevaluacion");
  const feedbackGlobal = document.getElementById("resultado-final");
  const inputNombre = document.getElementById("piloto-nombre");
  const inputCodigo = document.getElementById("p5-text");

  // --- BLOQUE A & B: VALIDACIÓN DE NOMBRE CON FEEDBACK DINÁMICO ---
  inputNombre.addEventListener("input", (e) => {
    const feedbackNombre = document.getElementById("feedback-nombre");
    const esValido = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]{3,}$/.test(e.target.value);

    if (esValido) {
      inputNombre.setAttribute("style", "border: 2px solid #4db8ff;");
      // Modificación de nodo de texto (Bloque A)
      feedbackNombre.firstChild.nodeValue = "✓ ID de Capitán validado.";
    } else {
      inputNombre.setAttribute("style", "border: 2px solid #ff6f61;");
      feedbackNombre.firstChild.nodeValue =
        "× El ID debe contener al menos 3 letras.";
    }
  });

  // ================================================================
  // BLOQUE B (EVENTOS DE TECLADO Y OBJETO EVENT)
  // ================================================================

  // 1. Evento de teclado 'keydown' + preventDefault para restringir entrada
  inputNombre.addEventListener("keydown", (e) => {
    // Bloquear números (códigos 48-57 en teclado estándar y 96-105 en numérico)
    if (
      (e.keyCode >= 48 && e.keyCode <= 57) ||
      (e.keyCode >= 96 && e.keyCode <= 105)
    ) {
      e.preventDefault(); // RA5: Control de flujo
      console.warn(
        "Caracter no permitido: Los números están bloqueados en el nombre.",
      );
    }
  });

  // 2. Evento de teclado 'keyup' + detección de tecla especial (Enter y Shift)
  inputCodigo.addEventListener("keyup", (e) => {
    // RA5: Uso de propiedad 'key' del objeto Event para detectar "Enter"
    if (e.key === "Enter") {
      const valor = e.target.value.toUpperCase(); // Propiedad target
      if (valor === "SALTO") {
        e.target.style.backgroundColor = "#1a4d1a"; // Estilo dinámico
        console.log(
          "Sistemas activados: Código de confirmación aceptado vía teclado.",
        );
      } else {
        e.target.style.backgroundColor = "#4d1a1a";
      }
    }

    // RA5: Detección de tecla especial modificadora (Shift)
    if (e.shiftKey) {
      console.log("Detección de objeto Event: Tecla Shift presionada.");
    }
  });

  // --- BLOQUE B: PROCESAMIENTO DEL FORMULARIO (SUBMIT) ---
  formulario.addEventListener("submit", (e) => {
    e.preventDefault(); // Evitar recarga de página

    let nota = 0;
    const totalPreguntas = 7;

    // --- BLOQUE A: Acceso por getElementsByName ---
    const opcionesP1 = document.getElementsByName("p1");
    opcionesP1.forEach((opcion) => {
      if (opcion.checked && opcion.value === "correcta") nota++;
    });

    const opcionesP2 = document.getElementsByName("p2");
    opcionesP2.forEach((opcion) => {
      if (opcion.checked && opcion.value === "correcta") nota++;
    });

    // Validaciones simples para el resto de campos
    if (document.getElementById("p3-select").value === "correcta") nota++;
    if (document.getElementById("p4-check").checked) nota++;
    if (inputCodigo.value.toUpperCase() === "SALTO") nota++;
    if (document.getElementById("p6-date").value !== "") nota++;
    if (document.getElementById("p7-number").value == "21") nota++;

    // --- BLOQUE A: LIMPIAR FEEDBACK PREVIO (Eliminación dinámica) ---
    while (feedbackGlobal.firstChild) {
      feedbackGlobal.removeChild(feedbackGlobal.firstChild);
    }

    // --- BLOQUE A: CREAR ELEMENTOS DE RESULTADO (Creación dinámica) ---
    const tituloInforme = document.createElement("h3");
    const textoTitulo = document.createTextNode("INFORME DE DIAGNÓSTICO");
    tituloInforme.appendChild(textoTitulo);

    const pResultado = document.createElement("p");
    const porcentaje = Math.round((nota / totalPreguntas) * 100);
    pResultado.appendChild(
      document.createTextNode(
        `Estado de Sistemas: ${porcentaje}% de integridad.`,
      ),
    );

    // Modificar atributos de estilo y clase según resultado
    feedbackGlobal.removeAttribute("style");
    feedbackGlobal.setAttribute("class", "resultado-visible");
    feedbackGlobal.style.border = `2px solid ${nota >= 4 ? "#4db8ff" : "#ff6f61"}`;

    // Inserción en el DOM
    feedbackGlobal.appendChild(tituloInforme);
    feedbackGlobal.appendChild(pResultado);
    feedbackGlobal.scrollIntoView({ behavior: "smooth" });
  });

  // --- BLOQUE B: EVENTO RESET ---
  formulario.addEventListener("reset", () => {
    feedbackGlobal.style.display = "none";
    inputNombre.removeAttribute("style");
    inputCodigo.style.backgroundColor = "";
    console.log("Formulario reiniciado: Nodos restaurados.");
  });
});
