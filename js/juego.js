/**
 * LÓGICA DEL JUEGO: Space Explorer Pro v3.4 (ESTABLE)
 * Finalizado: Causa de muerte, Sombras dinámicas y Balance.
 */

let miNave;
const logAcciones = [];
let misionesExitosas = 0;

const destinosGalacticos = [
    ["Nebulosa de Orión", 1344, "Bajo"],
    ["Agujero Negro Sagitario A*", 26000, "Extremo"],
    ["Sistema Proxima Centauri", 4.2, "Medio"],
    ["Estrella de Barnard", 5.9, "Bajo"],
    ["Gliese 581g", 20.3, "Alto"],
    ["Kepler-186f", 492, "Medio"]
];

function Nave(nombre, combustible, potencia) {
    this.nombre = nombre;
    this.combustible = combustible;
    this.combustibleMax = combustible;
    this.potencia = potencia;
    this.integridad = 100;
    this.estaCritica = false;

    this.inventario = {
        chatarra: 0,
        celulas: 0
    };

    this.viajar = function (distancia) {
        let gasto = Math.floor(distancia * (100 / this.potencia));
        if (this.combustible >= gasto) {
            this.combustible -= gasto;
            return true;
        }
        return false;
    };

    this.usarRecursos = function () {
        if (this.integridad <= 0) return;

        if (this.inventario.chatarra > 0) {
            if (this.integridad < 100) {
                this.integridad = Math.min(this.integridad + 20, 100);
                this.inventario.chatarra--;
                if (this.integridad > 40) this.estaCritica = false;
                gestionarLog("🔧 REPARACIÓN: +20% casco.");
            } else {
                gestionarLog("🛡️ AVISO: Casco al 100%.");
            }
        }

        if (this.inventario.celulas > 0) {
            this.combustible = Math.min(this.combustible + 1500, this.combustibleMax);
            this.inventario.celulas--;
            gestionarLog("🔋 RECARGA: +1500 plasma.");
        }
        actualizarInterfaz("Sistemas de mantenimiento");
    };
}

function iniciarMision(indiceDestino) {
    if (miNave.integridad <= 0) return "Nave inoperativa.";

    const destino = destinosGalacticos[indiceDestino][0];
    const distancia = destinosGalacticos[indiceDestino][1];
    const riesgoBase = destinosGalacticos[indiceDestino][2];

    let dañoTotalPotencial = 15 + Math.floor(distancia / 1000) * 5 + (riesgoBase === "Extremo" ? 35 : riesgoBase === "Alto" ? 20 : 10);

    if (miNave.viajar(distancia)) {
        gestionarLog(`🚀 SALTO: Viajando a ${destino}...`);
        dispararEventoAleatorio();

        if (miNave.integridad <= 0) {
            miNave.integridad = 0;
            gestionarLog("💀 CAUSA: Colisión catastrófica en ruta.");
            mostrarBotonReinicio();
            return "GAME OVER";
        }

        if (Math.random() * 100 > 30) {
            misionesExitosas++;
            gestionarLog(`✅ LLEGADA: Aterrizaje seguro en ${destino}.`);
            
            const suerte = Math.random() * 100;
            if (suerte > 70) { miNave.inventario.chatarra++; gestionarLog(`💎 RECURSOS: Chatarra en ${destino}.`); }
            else if (suerte > 40) { miNave.inventario.celulas++; gestionarLog(`🔋 RECURSOS: Célula en ${destino}.`); }
            
            return `¡Éxito en ${destino}!`;
        } else {
            miNave.integridad -= dañoTotalPotencial;
            gestionarLog(`💥 IMPACTO: Daños en ${destino}. -${dañoTotalPotencial}% integridad.`);

            if (miNave.integridad <= 0) {
                miNave.integridad = 0;
                gestionarLog(`💀 CAUSA: Impacto fatal en ${destino}.`);
                mostrarBotonReinicio();
                return "GAME OVER";
            }
            
            if (miNave.integridad <= 40) miNave.estaCritica = true;
            return `¡Daños estructurales!`;
        }
    } else {
        miNave.integridad = 0;
        gestionarLog("💀 CAUSA: Nave a la deriva por falta de plasma.");
        mostrarBotonReinicio();
        return "GAME OVER";
    }
}

function actualizarInterfaz(resultado) {
    const statusNave = document.getElementById('nave-status');
    const imagenNave = document.getElementById('nave-visual');
    const logMision = document.getElementById('log-mision');
    const barraVida = document.getElementById('relleno-integridad');
    const barraEnergia = document.getElementById('relleno-combustible');

    if (barraVida) barraVida.style.width = miNave.integridad + "%";
    if (barraEnergia) barraEnergia.style.width = (miNave.combustible / miNave.combustibleMax) * 100 + "%";

    const juegoTerminado = miNave.integridad <= 0;

    if (juegoTerminado) {
        const imagenRandom = Math.random() * 100;
        imagenNave.src = imagenRandom > 50 ? "assets/estrellado.jpg" : "assets/estrellado1.jpg";
        imagenNave.style.transform = "rotate(25deg)";
        imagenNave.style.filter = "grayscale(1) sepia(0.5)";
        document.querySelectorAll('.btn-viaje').forEach(b => b.disabled = true);
    } else if (miNave.estaCritica) {
        imagenNave.src = "assets/damaged.jpg";
        imagenNave.style.filter = "drop-shadow(0 0 15px #ff4d4d)";
        imagenNave.style.transform = "rotate(0deg)";
    } else {
        imagenNave.src = "assets/rick.jpg";
        imagenNave.style.filter = "drop-shadow(0 0 15px #4db8ff)";
        imagenNave.style.transform = "rotate(0deg)";
    }

    let historialHTML = logAcciones.slice().reverse().map(log => {
        const estilo = log.includes("CAUSA") ? 'style="color: #ff4d4d; font-weight: bold;"' : '';
        return `<li ${estilo}>${log}</li>`;
    }).join("");

    logMision.innerHTML = `
        <p style="color:#4db8ff; margin-bottom:5px;"><strong>📡 ESTADO: ${resultado}</strong></p>
        <div style="border: 1px solid #4db8ff; padding: 10px; margin-bottom: 10px; background: rgba(0,0,0,0.6); border-radius: 5px;">
            <p style="margin:0; font-size: 0.8em; color: #4db8ff;">📦 INVENTARIO:</p>
            <p style="margin:5px 0; font-size: 0.9em;">🛠️ Chatarra: ${miNave.inventario.chatarra} | 🔋 Células: ${miNave.inventario.celulas}</p>
            <button id="btn-recursos" onclick="miNave.usarRecursos()" ${juegoTerminado ? 'disabled' : ''} 
                    style="cursor:${juegoTerminado ? 'not-allowed' : 'pointer'}; background:${juegoTerminado ? '#555' : '#4db8ff'}; border:none; border-radius:3px; padding:5px 10px; font-weight:bold; color:black;">
                ${juegoTerminado ? 'SISTEMAS OFFLINE' : 'USAR SUMINISTROS'}
            </button>
        </div>
        <ul style="list-style:none; padding:0; font-size:0.85em; color:#ddd; line-height:1.6;">${historialHTML}</ul>
    `;

    statusNave.textContent = `Plasma: ${Math.max(0, Math.floor(miNave.combustible))} | Casco: ${miNave.integridad}%`;
}

function gestionarLog(mensaje) {
    logAcciones.push(mensaje);
    if (logAcciones.length > 5) logAcciones.shift();
}

function dispararEventoAleatorio() {
    const azar = Math.random() * 100;
    if (azar > 85) {
        miNave.combustible = Math.min(miNave.combustible + 400, miNave.combustibleMax);
        gestionarLog("✨ EVENTO: Nube de plasma hallada. +400.");
    } else if (azar < 15) {
        miNave.integridad -= 10;
        gestionarLog("☄️ EVENTO: Meteoritos detectados. -10% integridad.");
    }
}

function mostrarBotonReinicio() {
    const btn = document.getElementById('btn-reiniciar-juego');
    if (btn) btn.style.display = "block";
}

function inicializarJuego() {
    miNave = new Nave("Explorador JS", 8000, 100); 
    misionesExitosas = 0;
    logAcciones.length = 0;
    gestionarLog("Sistemas online. Iniciando misión.");
    const btnReiniciar = document.getElementById('btn-reiniciar-juego');
    if(btnReiniciar) btnReiniciar.style.display = "none";
    document.querySelectorAll('.btn-viaje').forEach(b => b.disabled = false);
    actualizarInterfaz("Sistemas Listos");
}

/**
 * GESTIÓN DE EVENTOS (BLOQUE B)
 */
document.addEventListener("DOMContentLoaded", () => {
    inicializarJuego();

    // Eventos para los botones de viaje
    document.querySelectorAll('.btn-viaje').forEach(boton => {
        // Evento de clic principal
        boton.addEventListener('click', (e) => {
            // BLOQUE B: Control de propagación
            e.stopPropagation();
            console.log("Propagación detenida en el botón de misión.");

            const idx = parseInt(e.target.dataset.idx);
            e.target.disabled = true;
            
            setTimeout(() => {
                const res = iniciarMision(idx);
                actualizarInterfaz(res);
                if (miNave.integridad > 0) e.target.disabled = false;
            }, 600);
        });

        // BLOQUE B: Eventos de Ratón (Mouseover / Mouseout)
        boton.addEventListener('mouseover', (e) => {
            e.target.style.filter = "brightness(1.5)";
            e.target.style.transition = "0.3s";
        });

        boton.addEventListener('mouseout', (e) => {
            e.target.style.filter = "brightness(1)";
        });
    });

    const btnReiniciar = document.getElementById('btn-reiniciar-juego');
    if(btnReiniciar) btnReiniciar.addEventListener('click', inicializarJuego);
});