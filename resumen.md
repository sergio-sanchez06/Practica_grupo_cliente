# 📑 Resumen del Programa: Space Explorer Pro v3.4

## 🎯 Objetivo del Sistema
El programa simula un entorno de exploración espacial donde el usuario debe gestionar una nave estelar, tomando decisiones de viaje basadas en el **balance de riesgo-recurso** para evitar la destrucción del vehículo.

---

## 🏗️ Arquitectura de la Lógica

### 1. Entidades Principales
* **Nave (Objeto):** Posee estados dinámicos como `combustible`, `integridad` (salud del casco) y un `inventario` de suministros.
* **Destinos (Matriz):** Base de datos que contiene nombres, distancias y niveles de peligro (Bajo, Medio, Alto, Extremo).

### 2. Mecánicas de Juego (Gameplay)
| Mecánica | Descripción |
| :--- | :--- |
| **Salto Espacial** | Calcula el gasto de plasma según la distancia y la potencia. |
| **Cálculo de Daño** | Si la misión falla, el daño se calcula combinando la distancia recorrida y el riesgo del destino. |
| **Mantenimiento** | Sistema de reparación manual que consume *Chatarra* para el casco o *Células* para el plasma. |
| **Eventos Azarosos** | Probabilidades de encuentro con meteoritos (daño) o nubes de energía (recarga). |



---

## 🖥️ Interfaz y Feedback Visual
El programa manipula el **DOM** para reflejar el estado de la misión en tiempo real:
* **Estados de la Nave:** * `Salud > 40%`: Estado óptimo (Estilo azul).
    * `Salud < 40%`: Estado crítico (Sombra roja y cambio de imagen).
    * `Salud = 0%`: *Game Over* (Imagen destruida, escala de grises y bloqueo de controles).
* **Terminal de Log:** Un historial dinámico que muestra los últimos 5 eventos importantes con códigos de color para alertas críticas.

---

## 💀 Condiciones de Derrota
El juego termina inmediatamente si ocurre cualquiera de los siguientes escenarios:
1.  **Falta de Plasma:** La nave se queda sin combustible en medio de un salto.
2.  **Colisión Catastrófica:** La integridad del casco llega a 0% debido a fallos en la misión o eventos aleatorios.

🚀 Documentación Expandida: Space Explorer Pro v3.4📖 Descripción GeneralSpace Explorer Pro es un motor de juego basado en texto y gestión de recursos desarrollado en JavaScript. El programa utiliza un modelo de programación orientada a objetos (POO) ligera para simular el comportamiento de una nave espacial en un entorno hostil, gestionando variables críticas mediante cálculos matemáticos y generación de números aleatorios.⚙️ Análisis de Módulos Técnicos1. El Motor de la Nave (Nave Constructor)La lógica se apoya en una función constructora que encapsula el estado físico y logístico:Eficiencia Energética: El gasto de combustible no es lineal, se calcula con la fórmula:$Gasto = \lfloor Distancia \times (\frac{100}{Potencia}) \rfloor$.Mantenimiento Preventivo: El método usarRecursos actúa como un despachador de inventario. Prioriza la seguridad, impidiendo reparaciones si el casco ya está al 100% para evitar el desperdicio de chatarra.2. Algoritmo de Riesgo y MisionesEl corazón del desafío reside en la función iniciarMision, que evalúa tres capas de peligro:Capa Estática: El riesgo base del destino (Bajo, Medio, Alto, Extremo).Capa Dinámica: Daño escalonado por cada 1,000 unidades de distancia.Capa de Azar: Un generador de probabilidad que decide si la nave aterriza con éxito o sufre un impacto estructural.3. Sistema de Eventos Aleatorios (dispararEventoAleatorio)Para evitar la predictibilidad, el juego ejecuta un "volado" probabilístico en cada viaje:Bonus (15%): Hallazgo de nubes de plasma (recarga gratuita).Penalización (15%): Cinturones de meteoritos (daño directo al casco).Neutral (70%): Viaje tranquilo sin incidentes externos.🎨 Lógica de Presentación (UI/UX)El programa separa la lógica de cálculo de la lógica de renderizado mediante la función actualizarInterfaz, la cual gestiona:Retroalimentación de Estado: Uso de drop-shadow y filtros CSS (grayscale, sepia) para comunicar visualmente el daño sin necesidad de texto adicional.Persistencia Visual: El log de acciones implementa una estructura de cola (LIFO para el usuario), mostrando siempre los 5 eventos más recientes para mantener el foco en la acción actual.Gestión de Control: Bloqueo dinámico de botones (disabled) para prevenir condiciones de carrera (race conditions) mientras se procesa la animación del viaje.📊 Tabla de Destinos y PeligrosidadDestinoDistancia (años luz/u)RiesgoDaño Potencial MáximoNebulosa de Orión1,344Bajo~30%Sistema Proxima Centauri4.2Medio~25%Gliese 581g20.3Alto~35%Sagitario A*26,000Extremo>100% (Mortal sin mejoras)🛠️ Posibles Extensiones (Roadmap)Para escalar este programa, se podrían implementar:Sistema de Experiencia: Incrementar la potencia de la nave tras N misiones exitosas.Persistencia de Datos: Guardar el progreso y las misionesExitosas en el localStorage.Economía: Añadir una tienda para intercambiar chatarra por mejoras permanentes.

📚 Diccionario Funcional: Space Explorer Pro
Este resumen detalla el propósito, los parámetros y la lógica interna de cada componente del código.

🏗️ Constructor y Estructura Base
Nave(nombre, combustible, potencia)
Es la función constructora (clase) que genera el objeto de la nave.

Propiedades: Define la vida (integridad), el tanque de energía (combustible), y el inventario (chatarra y células).

Método viajar(distancia): Calcula si hay suficiente plasma para el trayecto. Si es así, lo resta y devuelve true.

Método usarRecursos(): La lógica de supervivencia. Verifica si tienes objetos en el inventario y, de ser así, restaura integridad (+20) o combustible (+1500) hasta el límite máximo permitido.

🎮 Lógica de Misión y Eventos
iniciarMision(indiceDestino)
Es el cerebro del juego. Se ejecuta cuando el jugador elige un destino.

Validación: Comprueba si la nave está destruida o si tiene combustible para el viaje.

Cálculo de Riesgo: Determina un "daño potencial" basado en la distancia y la peligrosidad del planeta.

Resolución: Usa Math.random() para decidir si la misión es un éxito (gana recursos) o un fracaso (pierde integridad).

Control de Muerte: Si la integridad baja a 0, activa la secuencia de fin de juego.

dispararEventoAleatorio()
Añade una capa de incertidumbre al viaje.

Tiene un 15% de probabilidad de encontrar una "Nube de plasma" (beneficio).

Tiene un 15% de probabilidad de sufrir un impacto de "Meteoritos" (perjuicio).

Se invoca automáticamente dentro de cada misión.

🖥️ Gestión de Interfaz y Logs
actualizarInterfaz(resultado)
Es la función encargada del renderizado (View).

Barras de estado: Traduce los valores numéricos de integridad y combustible en el ancho visual de las barras de progreso.

Motor Gráfico: Cambia el src y los filtros CSS (filter) de la imagen de la nave según si está sana, dañada o destruida.

Interfaz de Inventario: Genera dinámicamente el HTML del inventario y los botones de uso de recursos.

gestionarLog(mensaje)
Controla la consola de comunicaciones del jugador.

Mantiene un historial de los últimos 5 eventos.

Utiliza el método .shift() para eliminar el mensaje más antiguo cuando la lista se llena, manteniendo el log limpio y relevante.

mostrarBotonReinicio()
Una función de utilidad simple que cambia el estilo CSS del botón de reinicio de display: none a block cuando la nave es destruida.

🏁 Inicialización y Ciclo de Vida
inicializarJuego()
Restablece el estado inicial del programa.

Crea una nueva instancia del objeto Nave.

Limpia los contadores de misiones y los logs.

Reactiva los botones de viaje que pudieron quedar bloqueados tras un Game Over.

document.addEventListener("DOMContentLoaded", ...)
Es el punto de entrada que conecta el código con el navegador.

Configura los Event Listeners de los botones.

Añade un setTimeout de 600ms a los viajes para dar una sensación de "carga" o "espera" mientras la nave viaja, mejorando la experiencia de usuario (UX).