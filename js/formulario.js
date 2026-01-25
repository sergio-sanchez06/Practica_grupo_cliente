/**
 * LÓGICA DEL FORMULARIO: Diagnóstico de Sistemas (RA5 + Ampliación Unidad 06)
 * 
 */

window.addEventListener("load", () => {
  const formulario = document.getElementById("form-autoevaluacion");
  const inputNombre = document.getElementById("piloto-nombre");
  const feedbackNombre = document.getElementById("feedback-nombre");
  const feedbackGlobal = document.getElementById("resultado-final");
  const rangeInput = document.getElementById("p4-range");
  const rangeValue = document.getElementById("val-range");

  // 1. VALIDACIÓN EN TIEMPO REAL CON REGEX (nombre del capitán)
  inputNombre.addEventListener("input", (e) => {
    const regexNombre = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ]{3,}$/;
    if (regexNombre.test(e.target.value)) {
    // Estado válido
    inputNombre.setAttribute("style", "border: 2px solid #4db8ff;");          
    feedbackNombre.textContent = "✓ ID de Capitán validado.";
    feedbackNombre.setAttribute("style", "color: #4db8ff;");                 
  } else {
    // Estado inválido
    inputNombre.setAttribute("style", "border: 2px solid #ff6f61;");          
    feedbackNombre.textContent = "× El ID debe contener al menos 3 letras.";
    feedbackNombre.setAttribute("style", "color: #ff6f61;");                 
  }
  });

  // 2. ACTUALIZACIÓN DINÁMICA DEL RANGO
  rangeInput.addEventListener("input", (e) => {
    rangeValue.textContent = `${e.target.value}%`;
  });

  // 3. EVENTOS DE FOCO en el campo nombre
  inputNombre.addEventListener("focus", () => {
    inputNombre.style.backgroundColor = "rgb(196, 196, 196)";
  });

  inputNombre.addEventListener("blur", () => {
    inputNombre.style.backgroundColor = "white";
  });

  // 4. Atajo Escape → reset del formulario
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      formulario.reset();
      console.log("Panel de diagnóstico reiniciado por comando de emergencia (ESC).");
    }
  });

  // Atajo Ctrl + Enter → envío directo del formulario
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "Enter") {
      if (formulario) {
        console.log("Acceso directo detectado: Enviando diagnóstico...");
        formulario.requestSubmit();
      }
    }
  });

  // 5. ENVÍO DEL FORMULARIO – con validación y puntuación
  formulario.addEventListener("submit", (event) => {
    event.preventDefault();

    let nota = 0;
    const totalPreguntas = 7;

    // ────────────────────────────────────────────────
    // BLOQUE A: Uso de getElementsByName para radio buttons
    // ────────────────────────────────────────────────
    const radiosP1 = document.getElementsByName("p1");
    let q1 = null;
    for (let radio of radiosP1) {
      if (radio.checked) {
        q1 = radio.value;
        break;
      }
    }

    // Pregunta 2 (select)
    const q2 = document.getElementById("p2-combobox").value;

    // ────────────────────────────────────────────────
    // BLOQUE A: Uso de getElementsByName para checkboxes
    // ────────────────────────────────────────────────
    const checkboxesP3 = document.getElementsByName("p3");
    let q3Correctas = 0;
    let q3Marcadas = 0;
    for (let checkbox of checkboxesP3) {
      if (checkbox.checked) {
        q3Marcadas++;
        if (checkbox.value === "correcta") q3Correctas++;
      }
    }

    const q4 = parseInt(document.getElementById("p4-range").value);
    const q5 = document.getElementById("p5-text").value.trim().toUpperCase();
    const q6 = document.getElementById("p6-date").value;
    const q7 = document.getElementById("p7-number").value;

    // Cálculo de nota
    if (q1 === "correcta") nota++;
    if (q2 === "correcta") nota++;
    if (q3Correctas === 2 && q3Marcadas === 2) nota++;
    if (q4 === 80) nota++;
    if (q5 === "SALTO") nota++;
    if (q6 !== "") nota++; 
    if (parseInt(q7) === 21) nota++;

    const porcentaje = Math.round((nota / totalPreguntas) * 100);
    const aprobado = nota >= 4;

    // Mostrar resultado final
    feedbackGlobal.style.display = "block";
    feedbackGlobal.style.border = `2px solid ${aprobado ? "#4db8ff" : "#ff6f61"}`;

    // Creamos nodos dinámicos
    while (feedbackGlobal.firstChild) {
      feedbackGlobal.removeChild(feedbackGlobal.firstChild);
    }

    const h3 = document.createElement("h3");
    h3.textContent = "INFORME DE DIAGNÓSTICO";
    feedbackGlobal.appendChild(h3);

    const p = document.createElement("p");
    p.textContent = `Estado: ${porcentaje}% (${aprobado ? "APTO" : "NO APTO"})`;
    feedbackGlobal.appendChild(p);

    feedbackGlobal.scrollIntoView({ behavior: "smooth" });
  });

  // 6. Evento RESET del formulario
  formulario.addEventListener("reset", () => {
    feedbackGlobal.style.display = "none";
    while (feedbackGlobal.firstChild) {
      feedbackGlobal.removeChild(feedbackGlobal.firstChild);
    }
    inputNombre.style.border = "1px solid #ccc";
    rangeValue.textContent = "50%";
    console.log("Panel de control limpio.");
  });

  // PreventDefault adicional
  formulario.addEventListener("submit", (e) => {
    e.preventDefault();
  });
});