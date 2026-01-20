/**
 * ARCHIVO PRINCIPAL: app.js
 * Propósito: Gestión Cross-browser y Navegación Dinámica (RA6)
 */

const configApp = {
    nombreProyecto: "AstroQuiz & Explorer",
    version: "2.0 (DOM Advanced)",
    autor: "Equipo de Desarrollo JS"
};

/**
 * BLOQUE C: Función genérica de registro de eventos (Cross-browser)
 * Cumple con el requisito de usar addEventListener o attachEvent
 */
function registrarEvento(elemento, evento, manejador) {
    if (elemento.addEventListener) {
        elemento.addEventListener(evento, manejador, false);
    } else if (elemento.attachEvent) {
        elemento.attachEvent("on" + evento, manejador);
    } else {
        elemento["on" + evento] = manejador;
    }
}

// Uso de la función compatible para la carga inicial
registrarEvento(window, 'load', () => {
    console.log(`${configApp.nombreProyecto} cargado con éxito.`);
    inicializarNavegacion();
    personalizarInterfaz();
});

/**
 * Gestión de navegación (Uso de Objeto Event)
 */
function inicializarNavegacion() {
    const botonesNav = document.getElementsByTagName("button"); // Acceso por TagName
    const secciones = document.querySelectorAll('.seccion-app');

    for (let i = 0; i < botonesNav.length; i++) {
        const boton = botonesNav[i];
        
        // Solo aplicar a botones de navegación
        if (boton.getAttribute("class") === "nav-link") {
            registrarEvento(boton, 'click', (e) => {
                // BLOQUE B: Uso del objeto Event (currentTarget y preventDefault si fuera link)
                const targetId = e.currentTarget.getAttribute("data-target");

                secciones.forEach(sec => {
                    sec.classList.remove('activa');
                    if (sec.id === targetId) {
                        sec.classList.add('activa');
                    }
                });
            });
        }
    }
}

/**
 * Modificación dinámica inicial (Bloque A)
 */
function personalizarInterfaz() {
    // Acceso por TagName para añadir metadatos a los títulos
    const titulos = document.getElementsByTagName("h2");
    for (let i = 0; i < titulos.length; i++) {
        titulos[i].setAttribute("data-version", configApp.version);
        titulos[i].setAttribute("title", "Sección verificada por el sistema");
    }

    // Modificación de un nodo de texto específico
    const footerCreditos = document.querySelector("footer p");
    if (footerCreditos && footerCreditos.firstChild) {
        footerCreditos.firstChild.nodeValue += " | v2.0 DOM Puro";
    }
}