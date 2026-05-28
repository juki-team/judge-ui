# 1 · Concursos

> Sección **Concursos** — ruta `/contests`

---

## ¿Qué es un concurso?

Un **concurso** (*contest*) es una competencia que agrupa un conjunto de problemas bajo:

- una **ventana de tiempo** (inicio y fin),
- **reglas de puntaje** (penalización, modo de calificación),
- **roles de participación** (quién puede competir, juzgar o solo observar), y
- un **scoreboard** (tabla de posiciones) que ordena a los participantes.

Es el contenedor donde los usuarios *resuelven* problemas de forma cronometrada y comparada.

---

## La lista de concursos

La página principal de la sección muestra los concursos en dos pestañas:

| Pestaña | Qué muestra |
|---------|-------------|
| **Classics** | Concursos normales de la organización, con su estado y fechas |
| **Globals** | Concursos *globales*: bancos de problemas siempre abiertos, sin tiempo |

Cada concurso de la lista muestra su **estado**, **nombre** y **fechas**. Si tienes permiso
para crear concursos, verás el botón **Crear** en la esquina superior.

---

## Estados de un concurso

El estado depende de la hora actual respecto a las fechas configuradas:

| Estado | Significado |
|--------|-------------|
| 🔵 **Futuro** | Aún no empieza |
| 🟢 **En vivo** (*live*) | En curso: se puede enviar soluciones |
| ❄️ **Congelado** (*frozen*) | En vivo, pero el scoreboard dejó de actualizarse en público |
| 🔇 **Silencioso** (*quiet*) | Tramo final: blackout total del scoreboard |
| ⚫ **Pasado** (*past*) | Terminó; puede habilitarse *upsolving* para seguir practicando |
| ♾️ **Endless** | Sin límites de tiempo: siempre abierto |
| 🌐 **Global** | Banco de problemas global, sin tiempo ni penalización |

### Periodo congelado y periodo silencioso

Para mantener la emoción al final, el scoreboard se "cierra" antes de que termine el concurso:

```
inicio ──── normal ──── [congelado] ──── [silencioso] ──── fin
                        ▲                ▲
                   se congela el     blackout total
                   scoreboard        del scoreboard
```

- **Periodo congelado** — los veredictos nuevos dejan de verse en la tabla pública. Los
  administradores y jueces sí pueden alternar entre vista *frozen* / *unfrozen*.
- **Periodo silencioso** — tramo aún más restringido, justo antes del cierre.

Ambos son opcionales: si no se configuran, el scoreboard se actualiza hasta el final.

---

## Plantillas de concurso

Al crear un concurso se parte de una **plantilla** que predefine las fechas y la penalización:

| Plantilla | Descripción |
|-----------|-------------|
| **Classic** | Formato ICPC: dura **5 horas**, se congela 1 h antes del fin, periodo silencioso los últimos 15 min, penalización de **20 min** por respuesta incorrecta |
| **Customized** | Totalmente manual: tú defines todas las fechas y la penalización |
| **Endless** | Sin límite de tiempo, sin penalización, abierto a todos |
| **Global** | Banco de problemas global (solo disponible para administradores del servicio) |

> La plantilla es solo un punto de partida. En cuanto cambias una fecha manualmente, el
> concurso pasa a considerarse **Customized**.

---

## Roles dentro de un concurso

Quién puede hacer qué dentro de un concurso:

| Rol | Puede… |
|-----|--------|
| 👀 **Espectador** (*viewer*) | Ver problemas, scoreboard, lista de envíos y aclaraciones |
| 🎫 **Invitado** (*guest*) | Lo mismo que un espectador, y **registrarse** al concurso |
| 🏃 **Concursante** (*contestant*) | Lo anterior, y **enviar soluciones** y aclaraciones |
| ⚖️ **Juez** (*judge*) | Lo anterior, y **ver el código** de los envíos en cualquier momento y **rejuzgar** |
| 👑 **Administrador** | Lo anterior, y **editar cualquier parámetro** del concurso |

El nivel de acceso general del concurso se define con el **tipo de acceso**: `PRIVATE`,
`RESTRICTED`, `PUBLIC` o `EXPOSED` (ver [Crear un concurso](./04-crear-concurso.md#3-miembros)).

---

## La vista de un concurso

Al abrir un concurso (`/contests/{clave}`) se muestran las siguientes pestañas. Algunas
aparecen solo según el rol del usuario y el estado del concurso:

### Overview (resumen)
Descripción del concurso en formato Markdown, más un panel lateral con: fechas de inicio,
fin, congelado y silencioso; penalización; si hay aclaraciones; lenguajes permitidos. Desde
aquí los participantes pueden **registrarse** y descargar el **problemset** en PDF.

Los administradores tienen aquí accesos extra: **bloquear/desbloquear el scoreboard** y
**habilitar/deshabilitar el *upsolving*** (resolver problemas después de que el concurso terminó).

### Problems (problemas)
Tabla de los problemas del concurso, con: índice (A, B, C…), clave, nombre, puntos y tasa de
éxito. Marca con ✓ / ✗ los problemas que ya intentaste. Al hacer clic en un problema se abre
para resolverlo dentro del concurso, con navegación anterior/siguiente.

### Scoreboard (tabla de posiciones)
Clasificación de los participantes por **puntos** y **penalización**. Incluye:
- alternar vista **congelada / descongelada** (solo jueces y administradores durante el blackout),
- **recalcular** el scoreboard,
- **descargar** en CSV o XLSX,
- **pantalla completa** para proyectar,
- agrupación por **grupos** del concurso si están definidos.

### Submissions (envíos)
Lista de todos los envíos realizados en el concurso.

### Clarifications (aclaraciones)
Canal de preguntas y respuestas durante el concurso. Solo aparece si el concurso tiene las
aclaraciones habilitadas.

### Members (miembros)
Lista de administradores, jueces, concursantes, invitados y espectadores del concurso.

### Events (eventos)
Bitácora de auditoría: registra las acciones realizadas sobre el concurso (quién y cuándo).
Los administradores pueden ver el detalle de cada evento.

> **Acciones rápidas** en la barra superior del concurso: **copiar** el concurso (crea uno
> nuevo a partir de este), **compartir**, y **editar** (solo administradores).

---

### Siguiente

- ¿Vas a organizar uno? → [Crear un concurso](./04-crear-concurso.md)
- Conoce la unidad que va dentro → [Problemas](./02-problemas.md)