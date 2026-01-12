/**
 * LÓGICA DEL JUEGO: Space Explorer Pro (RA4 & RA5)
 * Mejoras: Daño dinámico por distancia, feedback visual aleatorio y gestión de assets.
 */

// 1. Ámbito de variables: Globales
let miNave;
const logAcciones = [];

// 2. Array multidimensional ampliado (Datos del universo)
const destinosGalacticos = [
    ["Nebulosa de Orión", 1344, "Bajo"],
    ["Agujero Negro Sagitario A*", 26000, "Extremo"],
    ["Sistema Proxima Centauri", 4.2, "Medio"],
    ["Estrella de Barnard", 5.9, "Bajo"],
    ["Gliese 581g", 20.3, "Alto"],
    ["Kepler-186f", 492, "Medio"]
];

/**
 * 3. Función Constructora (RA4)
 */
function Nave(nombre, combustible, potencia) {
    this.nombre = nombre;
    this.combustible = combustible;
    this.potencia = potencia;
    this.integridad = 100;

    // 4. Método de viaje: Cálculo de consumo
    this.viajar = function (distancia) {
        let gasto = Math.floor(distancia * (100 / this.potencia));
        if (this.combustible >= gasto) {
            this.combustible -= gasto;
            return true;
        }
        return false;
    };
}

/**
 * 5. Función de Misión con DAÑO DINÁMICO (RA4 - Lógica avanzada)
 */
function iniciarMision(indiceDestino) {
    if (miNave.integridad <= 0) {
        return "CRÍTICO: Nave inoperativa. Reinicie el simulador.";
    }

    const destino = destinosGalacticos[indiceDestino][0];
    const distancia = destinosGalacticos[indiceDestino][1];
    const riesgoBaseStr = destinosGalacticos[indiceDestino][2];

    // --- LÓGICA: DAÑO POR DISTANCIA (Punto clave RA4) ---
    // Calculamos un daño extra: 5 puntos por cada 1000 años luz recorridos
    let dañoPorDistancia = Math.floor(distancia / 1000) * 5;

    // Mapeamos el nivel de riesgo a daño numérico
    let riesgoExtra = (riesgoBaseStr === "Extremo") ? 35 : (riesgoBaseStr === "Alto") ? 20 : 10;

    // El daño total potencial si ocurre un accidente
    let dañoTotalPotencial = 15 + dañoPorDistancia + riesgoExtra;

    // Función anidada para probabilidad de éxito
    function calcularProbabilidadExito() {
        const suerte = Math.random() * 100;
        // La distancia penaliza la probabilidad (máximo 20% de penalización)
        const penalizadorDistancia = Math.min(distancia / 5000, 20);
        return suerte > (25 + penalizadorDistancia);
    }

    if (miNave.viajar(distancia)) {
        if (calcularProbabilidadExito()) {
            gestionarLog(`Éxito: Salto a ${destino} completado.`);
            return `¡Misión cumplida en ${destino}!`;
        } else {
            // Aplicamos el daño calculado dinámicamente según distancia y riesgo
            miNave.integridad -= dañoTotalPotencial;

            if (miNave.integridad <= 0) {
                miNave.integridad = 0;
                gestionarLog(`🚨 CATÁSTROFE: Nave destruida por fatiga espacial en ${destino}`);
                mostrarBotonReinicio();
                return "La nave se ha desintegrado por la distancia. Fin de la partida.";
            }

            gestionarLog(`Fallo: Daño estructural de ${dañoTotalPotencial}% en ${destino}`);
            return `¡Alerta! El salto a ${distancia} AL ha causado daños graves.`;
        }
    } else {
        return "ERROR: Combustible insuficiente para el salto.";
    }
}

/**
 * 6. Gestión de Historial y Log
 */
function gestionarLog(mensaje) {
    logAcciones.push(mensaje);
    if (logAcciones.length > 5) logAcciones.shift();
}

function mostrarBotonReinicio() {
    const btn = document.getElementById('btn-reiniciar-juego');
    if (btn) btn.style.display = "block";
}

function inicializarJuego() {
    miNave = new Nave("Explorador JS", 50000, 80);
    logAcciones.length = 0;
    logAcciones.push("Sistemas de navegación en línea.");
    const btn = document.getElementById('btn-reiniciar-juego');
    if (btn) btn.style.display = "none";
    
    // Restaurar estado de botones
    const botonesViaje = document.querySelectorAll('.btn-viaje');
    botonesViaje.forEach(b => b.disabled = false);

    actualizarInterfaz("Sistemas Listos");
}

/**
 * 7. Interacción y Feedback Visual (RA5)
 */
function actualizarInterfaz(resultado) {
    const statusNave = document.getElementById('nave-status');
    const imagenNave = document.getElementById('nave-visual');
    const logMision = document.getElementById('log-mision');

    // Control de assets y azar de muerte
    if (miNave.integridad <= 0) {
        const probabilidadFoto = Math.random() * 100;
        console.log("Probabilidad de imagen de muerte:", probabilidadFoto);

        // Determinamos la imagen basada en el azar
        let rutaImagen = (probabilidadFoto >= 50) ? "assets/estrellado.jpg" : "assets/estrellado1.jpg";
        
        // TRUCO: Añadimos un timestamp para forzar al navegador a cambiar la imagen realmente
        imagenNave.src = rutaImagen + "?t=" + new Date().getTime();

        imagenNave.style.transform = "rotate(20deg) translateY(30px)";
        // imagenNave.style.filter = "grayscale(1) sepia(1) hue-rotate(-50deg)";
        
        // Bloquear botones al morir
        document.querySelectorAll('.btn-viaje').forEach(b => b.disabled = true);

    } else if (miNave.integridad < 40) {
        // Estado de daño crítico pero funcional
        imagenNave.src = "assets/damaged.jpg"; 
        imagenNave.style.transform = "rotate(0deg)";
        imagenNave.style.filter = "drop-shadow(0 0 10px red) brightness(0.7)";
    } else {
        // Estado óptimo
        imagenNave.src = "assets/rick.jpg";
        imagenNave.style.transform = "rotate(0deg)";
        imagenNave.style.filter = "drop-shadow(0 0 15px #4db8ff)";
    }

    // Actualización del Log HTML
    let historialHTML = logAcciones.map(log => `<li>${log}</li>`).join("");
    logMision.innerHTML = `
        <p>📡 ÚLTIMO INFORME: ${resultado}</p>
        <ul class="log-lista" style="list-style: none; padding: 0; color: #ccc;">${historialHTML}</ul>
    `;

    // Actualización de barras de estado
    statusNave.textContent = `Plasma: ${miNave.combustible} | Casco: ${miNave.integridad}%`;
    statusNave.style.color = miNave.integridad < 30 ? "#ff6f61" : "#4db8ff";
    statusNave.style.fontWeight = "bold";
}

/**
 * 8. Eventos de Usuario
 */
document.addEventListener("DOMContentLoaded", () => {
    inicializarJuego();

    const botonesViaje = document.querySelectorAll('.btn-viaje');
    botonesViaje.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const idx = parseInt(e.target.dataset.idx);
            const textoOriginal = e.target.innerText;

            // Feedback visual inmediato (RA5)
            e.target.disabled = true;
            e.target.innerText = "🚀 SALTANDO...";

            setTimeout(() => {
                const resultadoMision = iniciarMision(idx);
                actualizarInterfaz(resultadoMision);
                
                // Si seguimos vivos, restauramos el botón
                if (miNave.integridad > 0) {
                    e.target.disabled = false;
                    e.target.innerText = textoOriginal;
                }
            }, 800);
        });
    });

    // Evento para el botón de reinicio
    document.getElementById('btn-reiniciar-juego').addEventListener('click', () => {
        inicializarJuego();
    });
});