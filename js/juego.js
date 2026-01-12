/**
 * LÓGICA DEL JUEGO: Space Explorer Pro v2.5 (Final Unificado)
 * Mejoras: Inventario de recursos, Daño persistente, Eventos y Muerte por deriva.
 */

// 1. Ámbito de variables: Globales
let miNave;
const logAcciones = [];
let misionesExitosas = 0; 

// 2. Datos del universo
const destinosGalacticos = [
    ["Nebulosa de Orión", 1344, "Bajo"],
    ["Agujero Negro Sagitario A*", 26000, "Extremo"],
    ["Sistema Proxima Centauri", 4.2, "Medio"],
    ["Estrella de Barnard", 5.9, "Bajo"],
    ["Gliese 581g", 20.3, "Alto"],
    ["Kepler-186f", 492, "Medio"]
];

/**
 * 3. Función Constructora con Inventario (RA4)
 */
function Nave(nombre, combustible, potencia) {
    this.nombre = nombre;
    this.combustible = combustible;
    this.combustibleMax = combustible; 
    this.potencia = potencia;
    this.integridad = 100;
    this.estaCritica = false; // Flag de persistencia visual
    
    // Inventario de recursos recolectados
    this.inventario = {
        chatarra: 0,   // Para reparar casco
        celulas: 0     // Para recargar plasma
    };

    this.viajar = function (distancia) {
        let gasto = Math.floor(distancia * (100 / this.potencia));
        if (this.combustible >= gasto) {
            this.combustible -= gasto;
            return true;
        }
        return false;
    };

    // Lógica para usar recursos desde la interfaz
    this.usarRecursos = function() {
        if (this.inventario.chatarra > 0 || this.integridad < 100) {
            this.integridad = Math.min(this.integridad + 20, 100);
            this.inventario.chatarra--;
            if (this.integridad > 40) this.estaCritica = false;
            gestionarLog("🔧 Reparación: +20% casco usando chatarra.");
        }
        if (this.inventario.celulas > 0) {
            this.combustible = Math.min(this.combustible + 700, this.combustibleMax);
            this.inventario.celulas--;
            gestionarLog("🔋 Recarga: +700 plasma usando célula.");
        }
        actualizarInterfaz("Sistemas actualizados");
    };
}

/**
 * 4. Funciones de Lógica de Juego
 */
function obtenerRango() {
    if (misionesExitosas >= 10) return "Almirante Galáctico";
    if (misionesExitosas >= 5) return "Comandante";
    if (misionesExitosas >= 2) return "Explorador Veterano";
    return "Cadete Espacial";
}

function dispararEventoAleatorio() {
    const azar = Math.random() * 100;
    if (azar > 85) {
        miNave.combustible = Math.min(miNave.combustible + 400, miNave.combustibleMax);
        gestionarLog("✨ EVENTO: ¡Nube de hidrógeno detectada! +400 plasma.");
    } else if (azar < 15) {
        miNave.integridad -= 10;
        gestionarLog("☄️ EVENTO: Lluvia de meteoritos. -10% integridad.");
    }
}

function iniciarMision(indiceDestino) {
    if (miNave.integridad <= 0) return "Nave inoperativa.";

    const destino = destinosGalacticos[indiceDestino][0];
    const distancia = destinosGalacticos[indiceDestino][1];
    const riesgoBase = destinosGalacticos[indiceDestino][2];

    let dañoTotalPotencial = 15 + Math.floor(distancia / 1000) * 5 + (riesgoBase === "Extremo" ? 35 : riesgoBase === "Alto" ? 20 : 10);

    if (miNave.viajar(distancia)) {
        dispararEventoAleatorio();

        // Check de estado crítico persistente
        if (miNave.integridad <= 40 && miNave.integridad > 0) miNave.estaCritica = true;

        if (miNave.integridad <= 0) {
            miNave.integridad = 0;
            mostrarBotonReinicio();
            return "🚨 DESASTRE: La nave se ha desintegrado.";
        }

        const penalizador = Math.min(distancia / 5000, 20);
        if (Math.random() * 100 > (25 + penalizador)) {
            misionesExitosas++;
            
            // --- NUEVO: RECOLECCIÓN AL LLEGAR AL PLANETA ---
            const suerte = Math.random();
            if (suerte > 0.6) {
                miNave.inventario.chatarra++;
                gestionarLog(`💎 RECURSOS: ¡Chatarra encontrada en ${destino}!`);
            } else if (suerte > 0.2) {
                miNave.inventario.celulas++;
                gestionarLog(`🔋 RECURSOS: ¡Célula de energía recogida en ${destino}!`);
            }

            return `¡Éxito en ${destino}! Rango: ${obtenerRango()}`;
        } else {
            miNave.integridad -= dañoTotalPotencial;
            if (miNave.integridad <= 40 && miNave.integridad > 0) miNave.estaCritica = true;
            if (miNave.integridad <= 0) {
                miNave.integridad = 0;
                mostrarBotonReinicio();
                return "🚨 Nave destruida en " + destino;
            }
            return "¡Fallo en la misión! Daño estructural.";
        }
    } else {
        // Lógica de muerte por combustible (Deriva)
        const distancias = destinosGalacticos.map(d => d[1]);
        const gastoMinimo = Math.min(...distancias) * (100 / miNave.potencia);
        if (miNave.combustible < gastoMinimo) {
            miNave.integridad = 0;
            mostrarBotonReinicio();
            return "💀 DERIVA: Sin combustible para saltar. La tripulación se ha perdido.";
        }
        return "Combustible insuficiente.";
    }
}

/**
 * 5. Gestión de Interfaz (RA5)
 */
function actualizarInterfaz(resultado) {
    const statusNave = document.getElementById('nave-status');
    const imagenNave = document.getElementById('nave-visual');
    const logMision = document.getElementById('log-mision');
    const barraVida = document.getElementById('relleno-integridad');
    const barraEnergia = document.getElementById('relleno-combustible');

    if (barraVida) barraVida.style.width = miNave.integridad + "%";
    if (barraEnergia) barraEnergia.style.width = (miNave.combustible / miNave.combustibleMax) * 100 + "%";

    // Visual de la nave (Persistente)
    if (miNave.integridad <= 0) {
        imagenNave.src = "assets/estrellado.jpg";
        imagenNave.style.transform = "rotate(25deg)";
        imagenNave.style.filter = "grayscale(1)";
        document.querySelectorAll('.btn-viaje').forEach(b => b.disabled = true);
    } else if (miNave.estaCritica) {
        imagenNave.src = "assets/damaged.jpg";
        imagenNave.style.filter = "drop-shadow(0 0 10px red)";
    } else {
        imagenNave.src = "assets/rick.jpg";
        imagenNave.style.filter = "drop-shadow(0 0 15px #4db8ff)";
        imagenNave.style.transform = "rotate(0deg)";
    }

    // Renderizado Log e Inventario
    let historialHTML = logAcciones.map(log => `<li>${log}</li>`).join("");
    logMision.innerHTML = `
        <p><strong>📡 ${resultado}</strong></p>
        <div style="border: 1px solid #4db8ff; padding: 8px; margin: 10px 0; background: rgba(0,0,0,0.5);">
            <p style="margin:0; font-size: 0.8em; color: #4db8ff;">📦 INVENTARIO:</p>
            <p style="margin:5px 0; font-size: 0.85em;">🛠️ Chatarra: ${miNave.inventario.chatarra} | 🔋 Células: ${miNave.inventario.celulas}</p>
            <button onclick="miNave.usarRecursos()" style="cursor:pointer; background:#4db8ff; border:none; border-radius:3px; padding:2px 5px; font-size:0.7em;">USAR RECURSOS</button>
        </div>
        <ul style="list-style:none; padding:0; font-size:0.8em; color:#bbb;">${historialHTML}</ul>
    `;

    statusNave.textContent = `Plasma: ${Math.max(0, miNave.combustible)} | Casco: ${miNave.integridad}% | ${obtenerRango()}`;
}

// Auxiliares
function gestionarLog(mensaje) {
    logAcciones.push(mensaje);
    if (logAcciones.length > 5) logAcciones.shift();
}

function mostrarBotonReinicio() {
    const btn = document.getElementById('btn-reiniciar-juego');
    if (btn) btn.style.display = "block";
}

function inicializarJuego() {
    miNave = new Nave("Explorador JS", 5000, 80);
    misionesExitosas = 0;
    logAcciones.length = 0;
    logAcciones.push("Sistemas listos. Esperando órdenes.");
    document.getElementById('btn-reiniciar-juego').style.display = "none";
    document.querySelectorAll('.btn-viaje').forEach(b => b.disabled = false);
    actualizarInterfaz("Inicio de Misión");
}

document.addEventListener("DOMContentLoaded", () => {
    inicializarJuego();
    document.querySelectorAll('.btn-viaje').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const idx = parseInt(e.target.dataset.idx);
            e.target.disabled = true;
            setTimeout(() => {
                const res = iniciarMision(idx);
                actualizarInterfaz(res);
                if (miNave.integridad > 0) e.target.disabled = false;
            }, 600);
        });
    });
    document.getElementById('btn-reiniciar-juego').addEventListener('click', inicializarJuego);
});