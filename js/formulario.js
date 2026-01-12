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

  // 1. VALIDACIÓN EN TIEMPO REAL CON REGEX (RA5)
  inputNombre.addEventListener("input", (e) => {
    // Expresión regular: Validar que el campo tenga al menos 3 letras y solo sean caracteres alfabéticos
    const regexNombre = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ]{3,}$/;

    if (regexNombre.test(e.target.value)) {
      inputNombre.style.border = "2px solid #4db8ff"; // Azul galáctico
      feedbackNombre.textContent = "✓ ID de Capitán validado.";
      feedbackNombre.style.color = "#4db8ff";
    } else {
      inputNombre.style.border = "2px solid #ff6f61"; // Naranja/Rojo astro
      feedbackNombre.textContent = "× El ID debe contener al menos 3 letras.";
      feedbackNombre.style.color = "#ff6f61";
    }
  });

  // 2. EVENTOS DE FOCO PARA EL CAMPO DEL NOMBRE
  inputNombre.addEventListener("focus", () => {
    inputNombre.style.backgroundColor = "rgba(77, 184, 255, 0.1)";
  });

  inputNombre.addEventListener("blur", () => {
    inputNombre.style.backgroundColor = "white";
  });

  // 3. EVENTO DE TECLADO PARA REINICIAR EL FORMULARIO
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      formulario.reset();
      console.log("Panel de diagnóstico reiniciado por comando de emergencia (ESC).");
    }
  });

  // 4. GESTIÓN DEL ENVÍO (SUBMIT) Y CÁLCULO DE NOTA (RA5)
  formulario.addEventListener("submit", (event) => {
    event.preventDefault(); // Evita el envío por defecto

    let nota = 0;
    const totalPreguntas = 3;

    // Obtención de valores
    const q1 = document.querySelector('input[name="p1"]:checked')?.value;
    const q2 = document.getElementById("p2-combobox").value;
    const q3 = document.querySelectorAll('input[name="p3"]:checked');

    // Lógica de corrección
    if (q1 === "correcta") nota++;
    if (q2 === "correcta") nota++;

    // Checkboxes (múltiple - requiere que ambas estén marcadas y ninguna incorrecta)
    let q3Correctas = 0;
    let q3Incorrectas = 0;
    
    q3.forEach((check) => {
      if (check.value === "correcta") q3Correctas++;
      else q3Incorrectas++;
    });
    
    // Suma punto si marcó las 2 correctas y ninguna incorrecta
    if (q3Correctas === 2 && q3Incorrectas === 0) nota++;

    // 5. FEEDBACK FINAL Y NOTA GLOBAL (RA5)
    const porcentaje = Math.round((nota / totalPreguntas) * 100);
    
    // HACEMOS VISIBLE EL CUADRO DE RESULTADO
    feedbackGlobal.style.display = "block";
    feedbackGlobal.style.border = `2px solid ${nota >= 2 ? "#4db8ff" : "#ff6f61"}`;

    feedbackGlobal.innerHTML = `
            <h3>INFORME DE DIAGNÓSTICO</h3>
            <p>Estado de los Sistemas: <strong>${porcentaje}% Operativo</strong></p>
            <p>Aciertos: ${nota} de ${totalPreguntas}</p>
            <p style="color: ${nota >= 2 ? '#4db8ff' : '#ff6f61'}">
                ${nota >= 2 
                    ? " TODOS LOS SISTEMAS NOMINALES. Autorizado para el salto espacial." 
                    : " ERROR EN LOS PROTOCOLOS. Revise el manual de vuelo inmediatamente."}
            </p>
        `;

    // Desplazamiento suave al resultado
    feedbackGlobal.scrollIntoView({ behavior: "smooth" });
  });

  // Evento Reset (RA5)
  formulario.addEventListener("reset", () => {
    feedbackGlobal.style.display = "none"; // Ocultamos el resultado de nuevo
    feedbackGlobal.innerHTML = "";
    inputNombre.style.border = "1px solid #ccc";
    console.log("Panel de control limpio.");
  });
});