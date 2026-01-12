/**
 * LÓGICA DEL FORMULARIO: Diagnóstico de Sistemas (RA5)
 * Requisitos: Eventos, Validación, Regex y Feedback.
 */

window.addEventListener("load", () => {
  // Cargar los elementos del DOM
  const formulario = document.getElementById("form-autoevaluacion");
  const inputNombre = document.getElementById("piloto-nombre");
  const feedbackNombre = document.getElementById("feedback-nombre");
  const feedbackGlobal = document.getElementById("resultado-final");
  const rangeInput = document.getElementById("p4-range");
  const rangeValue = document.getElementById("val-range");

  // 1. VALIDACIÓN EN TIEMPO REAL CON REGEX (RA5)
  inputNombre.addEventListener("input", (e) => {
    // Expresión regular: Validar que el campo tenga al menos 3 letras y solo sean caracteres alfabéticos
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

  // 2. ACTUALIZACIÓN DINÁMICA DEL RANGO (RA5)
  // Muestra el porcentaje del slider en tiempo real
  rangeInput.addEventListener("input", (e) => {
    rangeValue.textContent = `${e.target.value}%`;
  });

  // 3. EVENTOS DE FOCO (RA5)
  inputNombre.addEventListener("focus", () => {
    inputNombre.style.backgroundColor = "rgba(77, 184, 255, 0.1)";
  });

  inputNombre.addEventListener("blur", () => {
    inputNombre.style.backgroundColor = "white";
  });

  // 4. EVENTO DE TECLADO (RA5)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      formulario.reset();
      console.log("Panel de diagnóstico reiniciado por comando de emergencia (ESC).");
    }
  });

  // 5. GESTIÓN DEL ENVÍO (SUBMIT) Y CÁLCULO DE NOTA (RA5)
  formulario.addEventListener("submit", (event) => {
    event.preventDefault(); 

    let nota = 0;
    const totalPreguntas = 7; // Ahora son 7 preguntas

    // Obtención de nuevos valores
    const q1 = document.querySelector('input[name="p1"]:checked')?.value;
    const q2 = document.getElementById("p2-combobox").value;
    const q3 = document.querySelectorAll('input[name="p3"]:checked');
    const q4 = parseInt(document.getElementById("p4-range").value);
    const q5 = document.getElementById("p5-text").value.trim().toUpperCase();
    const q6 = document.getElementById("p6-date").value; // Tipo Date
    const q7 = document.getElementById("p7-number").value; // Tipo Number

    // Lógica de corrección (P1 a P5 igual)
    if (q1 === "correcta") nota++;
    if (q2 === "correcta") nota++;
    
    let q3Correctas = 0;
    q3.forEach(c => { if(c.value === "correcta") q3Correctas++; });
    if (q3Correctas === 2 && q3.length === 2) nota++;

    if (q4 === 80) nota++;
    if (q5 === "SALTO") nota++;

    // P6: Correcta si selecciona cualquier fecha (validamos que no esté vacía)
    if (q6 !== "") nota++; 
    
    // P7: Correcta si el número es exactamente 21
    if (parseInt(q7) === 21) nota++;

    // Cálculo de porcentaje y feedback
    const porcentaje = Math.round((nota / totalPreguntas) * 100);
    const aprobado = nota >= 4; // Se aprueba con 4 de 7

    feedbackGlobal.style.display = "block";
    feedbackGlobal.style.border = `2px solid ${aprobado ? "#4db8ff" : "#ff6f61"}`;
    feedbackGlobal.innerHTML = `
            <h3>INFORME DE DIAGNÓSTICO</h3>
            <p>Estado de los Sistemas: <strong>${porcentaje}% Operativo</strong></p>
            <p>Aciertos: ${nota} de ${totalPreguntas}</p>
            <p style="color: ${aprobado ? '#4db8ff' : '#ff6f61'}">
                ${aprobado 
                    ? "✓ TODOS LOS SISTEMAS NOMINALES. Autorizado para el salto espacial." 
                    : "× ERROR EN LOS PROTOCOLOS. Revise el manual de vuelo inmediatamente."}
            </p>
        `;

    feedbackGlobal.scrollIntoView({ behavior: "smooth" });
  });

  // Evento Reset (RA5)
  formulario.addEventListener("reset", () => {
    feedbackGlobal.style.display = "none";
    feedbackGlobal.innerHTML = "";
    inputNombre.style.border = "1px solid #ccc";
    rangeValue.textContent = "50%"; // Reset del texto del slider
    console.log("Panel de control limpio.");
  });
});