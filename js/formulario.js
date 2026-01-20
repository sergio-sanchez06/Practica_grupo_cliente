/**
 * LÓGICA DEL FORMULARIO: Diagnóstico de Sistemas (RA5)
 */

window.addEventListener("load", () => {
  const formulario = document.getElementById("form-autoevaluacion");
  const inputNombre = document.getElementById("piloto-nombre");
  const feedbackNombre = document.getElementById("feedback-nombre");
  const feedbackGlobal = document.getElementById("resultado-final");
  const rangeInput = document.getElementById("p4-range");
  const rangeValue = document.getElementById("val-range");

  // 1. VALIDACIÓN EN TIEMPO REAL CON REGEX
  inputNombre.addEventListener("input", (e) => {
    const regexNombre = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ]{3,}$/;
    if (regexNombre.test(e.target.value)) {
      inputNombre.style.border = "2px solid #4db8ff";
      feedbackNombre.textContent = "✓ ID de Capitán validado.";
      feedbackNombre.style.color = "#4db8ff";
    } else {
      inputNombre.style.border = "2px solid #ff6f61";
      feedbackNombre.textContent = "× El ID debe contener al menos 3 letras.";
      feedbackNombre.style.color = "#ff6f61";
    }
  });

  // 2. ACTUALIZACIÓN DINÁMICA DEL RANGO
  rangeInput.addEventListener("input", (e) => {
    rangeValue.textContent = `${e.target.value}%`;
  });

  // 3. EVENTOS DE FOCO
  inputNombre.addEventListener("focus", () => {
    inputNombre.style.backgroundColor = "rgb(196, 196, 196)";
  });

  inputNombre.addEventListener("blur", () => {
    inputNombre.style.backgroundColor = "white";
  });

  // 4. EVENTO DE TECLADO ORIGINAL (Escape)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      formulario.reset();
      console.log("Panel de diagnóstico reiniciado por comando de emergencia (ESC).");
    }
  });

  // --- NUEVO: BLOQUE B (Propiedades objeto Event: ctrlKey + key) ---
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "Enter") {
      const formulario = document.getElementById("form-autoevaluacion");
      if (formulario) {
        console.log("Acceso directo detectado: Enviando diagnóstico...");
        formulario.requestSubmit();
      }
    }
  });

  // 5. GESTIÓN DEL ENVÍO ORIGINAL
  formulario.addEventListener("submit", (event) => {
    event.preventDefault();

    let nota = 0;
    const totalPreguntas = 7;

    const q1 = document.querySelector('input[name="p1"]:checked')?.value;
    const q2 = document.getElementById("p2-combobox").value;
    const q3 = document.querySelectorAll('input[name="p3"]:checked');
    const q4 = parseInt(document.getElementById("p4-range").value);
    const q5 = document.getElementById("p5-text").value.trim().toUpperCase();
    const q6 = document.getElementById("p6-date").value;
    const q7 = document.getElementById("p7-number").value;

    if (q1 === "correcta") nota++;
    if (q2 === "correcta") nota++;
    let q3Correctas = 0;
    q3.forEach(c => { if (c.value === "correcta") q3Correctas++; });
    if (q3Correctas === 2 && q3.length === 2) nota++;
    if (q4 === 80) nota++;
    if (q5 === "SALTO") nota++;
    if (q6 !== "") nota++; 
    if (parseInt(q7) === 21) nota++;

    const porcentaje = Math.round((nota / totalPreguntas) * 100);
    const aprobado = nota >= 4;

    feedbackGlobal.style.display = "block";
    feedbackGlobal.style.border = `2px solid ${aprobado ? "#4db8ff" : "#ff6f61"}`;
    feedbackGlobal.innerHTML = `<h3>INFORME DE DIAGNÓSTICO</h3><p>Estado: ${porcentaje}%</p>`;
    feedbackGlobal.scrollIntoView({ behavior: "smooth" });
  });

  // Evento Reset original
  formulario.addEventListener("reset", () => {
    feedbackGlobal.style.display = "none";
    feedbackGlobal.innerHTML = "";
    inputNombre.style.border = "1px solid #ccc";
    rangeValue.textContent = "50%";
    console.log("Panel de control limpio.");
  });

  // El preventDefault extra que pediste dejar
  const form = document.getElementById("form-autoevaluacion");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
  });
});