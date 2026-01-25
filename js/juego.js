/**
 * LÓGICA DEL JUEGO: Space Explorer Pro v3.4 – Ampliación Unidad 06
 * 
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
  ["Kepler-186f", 492, "Medio"],
];

function Nave(nombre, combustible, potencia) {
  this.nombre = nombre;
  this.combustible = combustible;
  this.combustibleMax = combustible;
  this.potencia = potencia;
  this.integridad = 100;
  this.estaCritica = false;

  this.inventario = { chatarra: 0, celulas: 0 };

  this.viajar = function(distancia) {
    let gasto = Math.floor(distancia * (100 / this.potencia));
    if (this.combustible >= gasto) {
      this.combustible -= gasto;
      return true;
    }
    return false;
  };

  this.usarRecursos = function() {
    if (this.integridad <= 0) return;

    let mensaje = "";
    if (this.inventario.chatarra > 0 && this.integridad < 100) {
      this.integridad = Math.min(this.integridad + 20, 100);
      this.inventario.chatarra--;
      if (this.integridad > 40) this.estaCritica = false;
      mensaje += "🔧 REPARACIÓN: +20% casco. ";
    }

    if (this.inventario.celulas > 0) {
      this.combustible = Math.min(this.combustible + 1500, this.combustibleMax);
      this.inventario.celulas--;
      mensaje += "🔋 RECARGA: +1500 plasma.";
    }

    if (mensaje) gestionarLog(mensaje.trim());
    actualizarInterfaz("Mantenimiento aplicado");
  };
}

/**
 * FUNCIÓN PRINCIPAL: intentarViajar(indiceDestino)
 * - Si hay plasma suficiente → viaja directamente
 * - Si falta plasma pero hay células → usa automáticamente las necesarias
 * - Si no hay ni plasma ni células suficientes → mensaje de error 
 */
function intentarViajar(indiceDestino) {
  const destino = destinosGalacticos[indiceDestino][0];
  const distancia = destinosGalacticos[indiceDestino][1];
  const gastoRequerido = Math.floor(distancia * (100 / miNave.potencia));

  let plasmaActual = miNave.combustible;

  // Hay suficiente plasma
  if (plasmaActual >= gastoRequerido) {
    return iniciarMision(indiceDestino);
  }

  // Falta plasma calcular cuántas células se necesitan
  const plasmaFaltante = gastoRequerido - plasmaActual;
  const celulasNecesarias = Math.ceil(plasmaFaltante / 1500); // cada célula da 1500

  if (miNave.inventario.celulas >= celulasNecesarias) {
    // Usar automáticamente las células necesarias
    let celulasUsadas = 0;
    let plasmaAñadido = 0;

    for (let i = 0; i < celulasNecesarias; i++) {
      if (miNave.inventario.celulas > 0) {
        miNave.combustible = Math.min(miNave.combustible + 1500, miNave.combustibleMax);
        miNave.inventario.celulas--;
        celulasUsadas++;
        plasmaAñadido += 1500;
      }
    }

    gestionarLog(
      `🔋 AUTO-RECARGA: Usadas ${celulasUsadas} célula(s) → +${plasmaAñadido.toLocaleString()} plasma para llegar a ${destino}.`
    );

    // Ahora sí hay plasma suficiente viajar
    return iniciarMision(indiceDestino);
  }

  // No hay plasma ni suficientes células → mensaje de error
  const logMision = document.getElementById("log-mision");
  const li = document.createElement("li");
  const texto = document.createTextNode(
    `❌ PLASMA INSUFICIENTE para ${destino}: Necesitas ${gastoRequerido.toLocaleString()} (tienes ${Math.floor(plasmaActual).toLocaleString()}). Tienes solo ${miNave.inventario.celulas} célula(s) disponibles.`
  );
  li.appendChild(texto);
  li.setAttribute(
    "style",
    "color:#ff6f61; font-weight:bold; border-left:3px solid #ff6f61; padding-left:5px;"
  );

  if (logMision.firstChild) {
    logMision.insertBefore(li, logMision.firstChild);
  } else {
    logMision.appendChild(li);
  }

  if (logMision.children.length > 6) {
    logMision.removeChild(logMision.lastChild);
  }

  return "Plasma insuficiente – recarga manualmente o recoge células.";
}

function iniciarMision(indiceDestino) {
  if (miNave.integridad <= 0) return "Nave inoperativa.";

  const destino = destinosGalacticos[indiceDestino][0];
  const distancia = destinosGalacticos[indiceDestino][1];
  const riesgoBase = destinosGalacticos[indiceDestino][2];

  let dañoTotalPotencial =
    15 +
    Math.floor(distancia / 1000) * 5 +
    (riesgoBase === "Extremo" ? 35 : riesgoBase === "Alto" ? 20 : 10);

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
      if (suerte > 70) {
        miNave.inventario.chatarra++;
        gestionarLog(`💎 RECURSOS: Chatarra en ${destino}.`);
      } else if (suerte > 40) {
        miNave.inventario.celulas++;
        gestionarLog(`🔋 RECURSOS: Célula en ${destino}.`);
      }

      return `¡Éxito en ${destino}!`;
    } else {
      miNave.integridad -= dañoTotalPotencial;
      gestionarLog(
        `💥 IMPACTO: Daños en ${destino}. -${dañoTotalPotencial}% integridad.`
      );

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

function gestionarLog(mensaje) {
  const contenedorLog = document.getElementById("log-mision");

  const li = document.createElement("li");
  const texto = document.createTextNode(mensaje);
  li.appendChild(texto);

  if (mensaje.includes("💀") || mensaje.includes("PLASMA INSUFICIENTE") || mensaje.includes("AUTO-RECARGA")) {
    li.setAttribute(
      "style",
      "color:#ff4d4d; font-weight:bold; border-left:3px solid red; padding-left:5px;"
    );
  } else if (mensaje.includes("✅")) {
    li.setAttribute("style", "color:#2ecc71;");
  }

  if (contenedorLog.firstChild) {
    contenedorLog.insertBefore(li, contenedorLog.firstChild);
  } else {
    contenedorLog.appendChild(li);
  }

  if (contenedorLog.children.length > 6) {
    contenedorLog.removeChild(contenedorLog.lastChild);
  }

  // Sección inventario mas el boton de usar los recursos
  let seccionInventario = document.getElementById("seccion-inventario-dinamica");

  if (!seccionInventario) {
    seccionInventario = document.createElement("div");
    seccionInventario.id = "seccion-inventario-dinamica";
    seccionInventario.setAttribute(
      "style",
      "margin:12px 0; padding:10px; background:rgba(30,50,80,0.4); border-radius:6px; border:1px solid #4db8ff33;"
    );

    contenedorLog.parentNode.insertBefore(seccionInventario, contenedorLog);
  }

  while (seccionInventario.firstChild) {
    seccionInventario.removeChild(seccionInventario.firstChild);
  }

  const strong = document.createElement("strong");
  strong.setAttribute("style", "color:#4db8ff;");
  strong.appendChild(document.createTextNode("📦 INVENTARIO: "));
  seccionInventario.appendChild(strong);

  const br = document.createElement("br");
  seccionInventario.appendChild(br);

  const txtInv = document.createTextNode(
    `🛠️ Chatarra: ${miNave.inventario.chatarra}   🔋 Células: ${miNave.inventario.celulas}  `
  );
  seccionInventario.appendChild(txtInv);

  const btnUsar = document.createElement("button");
  btnUsar.id = "btn-usar-recursos-din";
  btnUsar.appendChild(document.createTextNode("USAR SUMINISTROS"));
  btnUsar.setAttribute(
    "style",
    "margin-left:15px; padding:6px 12px; background:#4db8ff; color:black; border:none; border-radius:4px; font-weight:bold; cursor:pointer;"
  );

  if (miNave.integridad <= 0 || (miNave.inventario.chatarra === 0 && miNave.inventario.celulas === 0)) {
    btnUsar.setAttribute("disabled", "disabled");
  }

  seccionInventario.appendChild(btnUsar);

  registrarEvento(btnUsar, "click", function(e) {
    e.preventDefault();
    miNave.usarRecursos();
    gestionarLog("→ Recursos utilizados (evento: " + e.type + ")");
  });
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
  let contenedor = document.querySelector("#game-container");
  let existe = document.getElementById("game-over-dinamico");

  if (!existe) {
    const div = document.createElement("div");
    div.id = "game-over-dinamico";
    div.setAttribute(
      "style",
      "position:absolute; top:30%; left:50%; transform:translate(-50%,-50%); background:rgba(200,0,0,0.85); color:white; padding:30px 50px; border-radius:12px; font-size:2.2rem; font-weight:bold; text-align:center; z-index:100; border:4px solid #ff4d4d; box-shadow:0 0 30px #ff0000;"
    );

    const texto = document.createTextNode("GAME OVER");
    div.appendChild(texto);
    contenedor.appendChild(div);
  }

  const btn = document.getElementById("btn-reiniciar-juego");
  if (btn) {
    btn.style.display = "block";
    btn.style.margin = "25px auto";
    btn.style.padding = "12px 30px";
    btn.style.fontSize = "1.1rem";

    if (btn.hasAttribute("disabled")) {
      btn.removeAttribute("disabled");
    }

    if (btn.firstChild && btn.firstChild.nodeType === 3) {
      btn.firstChild.nodeValue = "REINICIAR MISIÓN";
    } else {
      btn.appendChild(document.createTextNode("REINICIAR MISIÓN"));
    }
  }

  const viajes = document.getElementsByClassName("btn-viaje");
  for (let i = 0; i < viajes.length; i++) {
    viajes[i].disabled = true;
  }
}

function actualizarEstadoVisualNave() {
  const imagenNave = document.getElementById("nave-visual");
  if (!imagenNave) return;

  const juegoTerminado = miNave.integridad <= 0;

  if (juegoTerminado) {
    const usarPrimera = Math.random() > 0.5;
    imagenNave.setAttribute("src", usarPrimera ? "assets/estrellado.jpg" : "assets/estrellado1.jpg");
    imagenNave.setAttribute("style", "transform: rotate(25deg); filter: grayscale(1) sepia(0.5);");
  } else if (miNave.estaCritica) {
    imagenNave.setAttribute("src", "assets/damaged.jpg");
    imagenNave.setAttribute("style", "filter: drop-shadow(0 0 15px #ff4d4d); transform: rotate(0deg);");
  } else {
    imagenNave.setAttribute("src", "assets/rick.jpg");
    imagenNave.setAttribute("style", "filter: drop-shadow(0 0 15px #4db8ff); transform: rotate(0deg);");
  }
}

function actualizarInterfaz(resultado) {
  const status = document.getElementById("nave-status");
  const texto = `Plasma: ${Math.max(0, Math.floor(miNave.combustible))} | Casco: ${miNave.integridad}%`;

  if (status.firstChild && status.firstChild.nodeType === 3) {
    status.firstChild.nodeValue = texto;
  } else {
    status.appendChild(document.createTextNode(texto));
  }

  const vida = document.getElementById("relleno-integridad");
  if (vida) vida.setAttribute("style", `width:${miNave.integridad}%`);

  const energia = document.getElementById("relleno-combustible");
  if (energia) {
    let porc = (miNave.combustible / miNave.combustibleMax) * 100;
    energia.setAttribute("style", `width:${porc}%`);
  }

  actualizarEstadoVisualNave();
}

/**
 * BLOQUE C – Función cross-browser para registrar eventos
 */
function registrarEvento(elemento, tipoEvento, manejador) {
  if (elemento.addEventListener) {
    elemento.addEventListener(tipoEvento, manejador, false);
  } else if (elemento.attachEvent) {
    elemento.attachEvent("on" + tipoEvento, manejador);
  } else {
    elemento["on" + tipoEvento] = manejador;
  }
}

/* ===============================================
   INICIALIZACIÓN Y EVENTOS (BLOQUE B)
   =============================================== */
document.addEventListener("DOMContentLoaded", function () {
  inicializarJuego();

  const botones = document.querySelectorAll(".btn-viaje");
  botones.forEach(function (boton) {
    registrarEvento(boton, "click", function (e) {
      e.stopPropagation();

      const idx = parseInt(boton.getAttribute("data-idx"));

      boton.disabled = true; // Temporal durante el intento

      const resultado = intentarViajar(idx);
      actualizarInterfaz(resultado);

      setTimeout(() => {
        if (miNave.integridad > 0) {
          boton.disabled = false; // Siempre vuelve a habilitar
        }
      }, 600);
    });

    registrarEvento(boton, "mouseover", function (e) {
      boton.style.filter = "brightness(1.5)";
    });

    registrarEvento(boton, "mouseout", function () {
      boton.style.filter = "brightness(1)";
    });
  });

  registrarEvento(document, "keydown", function (e) {
    if (e.keyCode === 13 && miNave.integridad <= 0) {
      e.preventDefault();
      inicializarJuego();
      console.log("Enter presionado para reinicio – ctrlKey:", e.ctrlKey);
    }
  });

  const btnReinicio = document.getElementById("btn-reiniciar-juego");
  if (btnReinicio) {
    registrarEvento(btnReinicio, "click", inicializarJuego);
  }

  registrarEvento(window, "load", function () {
    console.log("Página completamente cargada (evento load)");
  });
});

function inicializarJuego() {
  miNave = new Nave("Explorador JS", 30000, 100);
  misionesExitosas = 0;
  logAcciones.length = 0;

  // BLOQUE A – Eliminación dinámica completa del log al reiniciar
  const logMision = document.getElementById("log-mision");
  while (logMision.firstChild) {
    logMision.removeChild(logMision.firstChild);
  }

  // Mensaje inicial
  const liInicial = document.createElement("li");
  liInicial.appendChild(document.createTextNode("Sistemas online. Iniciando misión."));
  logMision.appendChild(liInicial);

  const btnReinicio = document.getElementById("btn-reiniciar-juego");
  if (btnReinicio) btnReinicio.style.display = "none";

  document.querySelectorAll(".btn-viaje").forEach((b) => {
    b.disabled = false;
    b.removeAttribute("disabled");
  });

  actualizarInterfaz("Sistemas Listos");

  const gameOver = document.getElementById("game-over-dinamico");
  if (gameOver && gameOver.parentNode) {
    gameOver.parentNode.removeChild(gameOver);
  }
}