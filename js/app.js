/**
 * ARCHIVO PRINCIPAL: app.js
 * Propósito: Orquestar la carga de la aplicación y gestionar la navegación.
 */

// 1. Objeto Literal
const configApp = {
    nombreProyecto: "AstroQuiz & Explorer",
    version: "1.0",
    autor: "Equipo de Desarrollo JS",
    fechaEntrega: "15/01/2026"
};

// 2. Evento de Carga
window.addEventListener('load', () => {
    console.log(`Cargando: ${configApp.nombreProyecto} v${configApp.version}`);
    inicializarNavegacion();
    generarContenidoExplicativo();
});

/**
 * Gestión de la navegación entre secciones
 */
function inicializarNavegacion() {
    const botonesNav = document.querySelectorAll('.nav-link');
    const secciones = document.querySelectorAll('.seccion-app');

    botonesNav.forEach(boton => {
        boton.addEventListener('click', (e) => {
            // Usamos currentTarget para asegurar que siempre leemos el data-target del botón
            const target = e.currentTarget.dataset.target;

            if (!target) return; // Seguridad

            secciones.forEach(sec => {
                sec.classList.remove('activa');
                if (sec.id === target) {
                    sec.classList.add('activa');
                    console.log(`Navegando a: ${target}`); // Para depuración
                }
            });
        });
    });
}

/**
 * Sección de contenido explicativo relacionada con la temática (Requisito RA4)
 * Genera el contenido de forma dinámica para demostrar uso de JS. 
 */

function generarContenidoExplicativo() {
    const contenedor = document.getElementById('contenido-explicativo');
    const conceptosEspaciales = [
        "Las estrellas de neutrones pueden girar a 600 veces por segundo.",
        "El espacio está completamente en silencio debido a la falta de atmósfera.",
        "Hay más estrellas en el universo que granos de arena en la Tierra."
    ];

    let html = "<h3>📚 Sabías que...</h3><ul>";
    // Recorrido de arrays (RA4)
    conceptosEspaciales.forEach(concepto => {
        html += `<li>${formatearTexto(concepto)}</li>`;
    });
    html += "</ul>";
    contenedor.innerHTML = html;
}

function formatearTexto(texto) {
    if (typeof texto !== 'string') return "";
    // Uso de trim() y toUpperCase()
    return texto.trim(); 
}

// Función con parámetros y retorno para utilidades generales
function formatearTexto(texto) {
    if (typeof texto !== 'string') return "";
    return texto.trim().toUpperCase();
}