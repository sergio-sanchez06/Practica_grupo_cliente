# Informe de Actualización: Salto a RA6 (Unidad 06)

Este informe detalla la evolución del código desde la versión base hasta la versión optimizada para cumplir con los requisitos de **Manipulación Avanzada del DOM y Gestión de Eventos**.

## 1. Comparativa de Archivos y Cambios

### A. Archivo `app.js`

**Estado Anterior:**

- Usaba `window.addEventListener` y `querySelectorAll` de forma directa.
- No incluía funciones de compatibilidad.

**Estado Modificado (RA6):**

- **Función genérica** → Se añadió `registrarEvento(elemento, evento, manejador)` que implementa lógica cross-browser (`addEventListener` vs `attachEvent`) → **Requisito Bloque C.1**
- **Acceso al DOM** → Se sustituyó el uso masivo de `querySelectorAll` por `getElementsByTagName` para demostrar variedad en selectores.

### B. Archivo `formulario.js`

**Estado Anterior:**

- Usaba `innerHTML` para generar los resultados.
- Carecía de validación de teclado avanzada.

**Estado Modificado (RA6):**

- **DOM puro** → Se eliminó completamente `innerHTML` del informe final.  
  Ahora se utiliza:
  - `createElement` para crear el título `<h3>`
  - `createTextNode` para los mensajes de éxito/error
- **Limpieza de nodos** → Se añadió bucle `while` con `removeChild` para eliminar resultados previos antes de generar nuevos.
- **Manipulación de atributos** → Implementación de `setAttribute`, `getAttribute` y `removeAttribute` para gestionar clases de feedback visual.

### C. Archivo `juego.js`

**Estado Anterior:**

- La actualización de la interfaz se hacía mediante plantillas de texto (strings).

**Estado Modificado (RA6):**

- **Nodos de texto** → Se utiliza `nodeValue` para actualizar el estado de la nave sin redibujar todo el HTML.
- **Gestión de log** → En lugar de reescribir la lista completa, se crean elementos `<li>` dinámicamente e se insertan con `insertBefore` o `appendChild`.

## 2. Nuevos Eventos Añadidos (Bloque B)

Para cumplir con el **Bloque B** del enunciado, se han incorporado los siguientes eventos que no existían o eran básicos en la versión anterior:

| Evento      | Ubicación       | Propósito y Propiedades de Event utilizadas                                                           |
| ----------- | --------------- | ----------------------------------------------------------------------------------------------------- |
| `keydown`   | `formulario.js` | Bloqueo de números: usa `e.keyCode` y `e.preventDefault()` para impedir dígitos en el nombre          |
| `keyup`     | `formulario.js` | Validación de código: detecta específicamente la tecla **Enter** (`e.key`) para validar "SALTO"       |
| `mouseover` | `juego.js`      | Feedback visual: cambia el brillo de los botones de misión (`target.style.filter`)                    |
| `mouseout`  | `juego.js`      | Restauración: devuelve el estado visual original al retirar el puntero                                |
| `click`     | `juego.js`      | Control de flujo: se añadió `e.stopPropagation()` para evitar burbujeo al contenedor de la cuadrícula |

## 3. Conclusión de Cumplimiento

El código modificado satisface **todos** los puntos exigidos en el enunciado:

- **DOM puro** → Evita `innerHTML` en la generación de resultados
- **Variedad de selectores** → Uso de `getElementById`, `getElementsByName` y `getElementsByTagName`
- **Objeto Event** → Emplea propiedades avanzadas: `key`, `keyCode`, `target`, `shiftKey`, etc.
- **Flujo de eventos** → Aplica tanto `preventDefault()` como `stopPropagation()`
- **Compatibilidad cross-browser** → Función de registro de eventos compatible con navegadores antiguos (`addEventListener` / `attachEvent`)

---

**Referencia del enunciado original (DIW – UT6 y UT7):**

Crear una página web estática para una ONG ficticia, aplicando buenas prácticas de diseño de interfaces, usabilidad y accesibilidad.

**Requisitos principales cumplidos en este proyecto (aunque este informe se centra en la parte de eventos y DOM):**

- Cabecera con título
- Menú de navegación
- Contenido principal
- Al menos una imagen
- Formulario de contacto
- Pie de página
- Botón de modo oscuro (implementado con jQuery)
- Enlace “Saltar al contenido principal”
- HTML semántico
- Imágenes con `alt`
- Formularios con `<label>`
- Navegable con teclado
- Contraste adecuado
- Texto legible
- Botón modo oscuro accesible (`aria-pressed`, `aria-label` dinámico según estado)
