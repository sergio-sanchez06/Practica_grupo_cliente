/**
 * LÓGICA DEL FORMULARIO: Diagnóstico de Sistemas (Ampliación RA6)
 */

window.addEventListener("load", () => {
  const formulario = document.getElementById("form-autoevaluacion");
  const feedbackGlobal = document.getElementById("resultado-final");

  // Validación de nombre con feedback dinámico (Atributos)
  const inputNombre = document.getElementById("piloto-nombre");
  inputNombre.addEventListener("input", (e) => {
    const feedbackNombre = document.getElementById("feedback-nombre");
    const esValido = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ]{3,}$/.test(e.target.value);
    
    if (esValido) {
      inputNombre.setAttribute("style", "border: 2px solid #4db8ff;");
      feedbackNombre.firstChild.nodeValue = "✓ ID de Capitán validado.";
    } else {
      inputNombre.setAttribute("style", "border: 2px solid #ff6f61;");
      feedbackNombre.firstChild.nodeValue = "× El ID debe contener al menos 3 letras.";
    }
  });

  // Procesamiento del formulario (Bloque B: preventDefault)
  formulario.addEventListener("submit", (e) => {
    e.preventDefault(); 

    let nota = 0;
    const totalPreguntas = 7;

    // --- BLOQUE A: Acceso por getElementsByName ---
    const opcionesP1 = document.getElementsByName("p1");
    opcionesP1.forEach(opcion => {
      if (opcion.checked && opcion.value === "correcta") nota++;
    });

    const opcionesP2 = document.getElementsByName("p2");
    opcionesP2.forEach(opcion => {
      if (opcion.checked && opcion.value === "correcta") nota++;
    });

    // Limpiar feedback previo (Eliminación dinámica)
    while (feedbackGlobal.firstChild) {
      feedbackGlobal.removeChild(feedbackGlobal.firstChild);
    }

    // Crear elementos de resultado (Creación dinámica)
    const tituloInforme = document.createElement("h3");
    const textoTitulo = document.createTextNode("INFORME DE DIAGNÓSTICO");
    tituloInforme.appendChild(textoTitulo);
    
    const pResultado = document.createElement("p");
    const porcentaje = Math.round((nota / totalPreguntas) * 100);
    pResultado.appendChild(document.createTextNode(`Estado de Sistemas: ${porcentaje}%`));

    // Modificar atributos de estilo según resultado
    feedbackGlobal.removeAttribute("style");
    feedbackGlobal.setAttribute("class", "resultado-visible");
    feedbackGlobal.style.border = `2px solid ${nota >= 4 ? "#4db8ff" : "#ff6f61"}`;

    feedbackGlobal.appendChild(tituloInforme);
    feedbackGlobal.appendChild(pResultado);
    feedbackGlobal.scrollIntoView({ behavior: "smooth" });
  });

  // Evento Reset (Bloque B)
  formulario.addEventListener("reset", () => {
    feedbackGlobal.setAttribute("style", "display: none;");
    console.log("Panel de diagnóstico reiniciado.");
  });
});