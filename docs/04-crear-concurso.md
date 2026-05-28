# 4 · Crear un concurso

> Ruta `/contests/new` — requiere el permiso `contests.create`

Esta guía recorre **paso a paso** la creación de un concurso y explica **cada parámetro** de
cada pestaña de configuración.

---

## Antes de empezar

- Necesitas permiso para crear concursos. Si no lo tienes, el botón **Crear** no aparece en
  la lista de concursos.
- El formulario está dividido en **pestañas**. Puedes moverte libremente entre ellas; los
  cambios se conservan hasta que guardas.
- El campo **Nombre** está siempre visible en la parte superior, fuera de las pestañas.

### Iniciar

1. Ve a la sección **Concursos**.
2. Pulsa **Crear**.
3. Escribe el **Nombre** del concurso en el campo superior.
4. Configura las pestañas (abajo se explica cada una).
5. Guarda con el botón de la barra superior.

---

## Pestañas

Al **crear** un concurso verás estas pestañas: **Overview**, **Settings**, **Members** y
**Problems**. Al **editar** uno existente aparece además **Delete**.

> En concursos de tipo **Global** las pestañas **Overview** y **Members** se ocultan, y
> también la configuración de tiempos.

---

## 1. Overview

Aquí se escribe la **descripción** del concurso con un editor **Markdown + Math**, que
soporta:

- texto enriquecido y fórmulas matemáticas,
- subida de imágenes,
- asistencia con IA.

Esta descripción es lo primero que ven los participantes en la pestaña *Overview* del
concurso. Conviene incluir: temática, modalidad, requisitos previos y staff.

---

## 2. Settings

La pestaña central de configuración. Sus bloques:

### Plantilla (*template*)

Punto de partida que predefine fechas y penalización:

| Plantilla | Efecto |
|-----------|--------|
| **Customized** | Configuración totalmente manual |
| **Classic** | 5 h de duración, congelado 1 h antes del fin, silencioso los últimos 15 min, penalización 20 min |
| **Endless** | Sin límites de tiempo ni penalización; abierto a todos |
| **Global** | Banco de problemas global *(solo administradores del servicio)* |

Cambiar la plantilla reescribe las fechas. Si luego ajustas una fecha a mano, el concurso
pasa a **Customized** automáticamente.

### Fechas y periodos

Solo se muestran en concursos con tiempo (no en *Endless* ni *Global*). La línea de tiempo es:

```
inicio ─── normal ─── congelado ─── silencioso ─── fin
```

| Parámetro | Qué configura |
|-----------|---------------|
| **Start date** | Fecha y hora de **inicio** del concurso |
| **Frozen period** | Cuándo empieza el **congelado** del scoreboard. Se indica en *minutos desde el inicio* o como *fecha* (toggle) |
| **Quiet period** | Cuándo empieza el **periodo silencioso**. También en *minutos* o *fecha* |
| **End time** | Cuándo **termina** el concurso. En *minutos de duración* o como *fecha* |

Bajo cada campo se muestra la **duración** calculada de cada tramo. El sistema garantiza el
orden `inicio ≤ congelado ≤ silencioso ≤ fin`; si introduces un valor fuera de rango, se
ajusta automáticamente.

> Para **desactivar** el congelado o el silencioso, hazlos coincidir con el fin del concurso.

### Penalty (penalización)

**Minutos de penalización por cada respuesta incorrecta.** Es la penalización estilo ICPC:
penaliza el tiempo total de un concursante por cada envío fallido a un problema que termine
resolviendo. Por defecto **20 min** en la plantilla *Classic*.

### Languages (lenguajes)

Lenguajes de programación en los que los concursantes pueden enviar soluciones. Se eligen en
un selector múltiple.

> ⚠️ Debe haber **al menos un lenguaje** seleccionado, o el concurso no será válido.

### Clarifications (aclaraciones)

Interruptor que habilita o no el canal de **preguntas y respuestas** durante el concurso. Si
está activo, aparece la pestaña *Clarifications* en la vista del concurso.

### Tags (etiquetas)

Etiquetas de texto libre para clasificar el concurso. Se escriben y se añaden una a una; se
pueden eliminar individualmente.

### Groups (grupos)

Grupos con **nombre** y **color** para segmentar a los participantes o los problemas (por
ejemplo: "Nivel A", "Nivel B"). Si defines grupos:

- en la pestaña **Problems** podrás asignar cada problema a un grupo,
- el **scoreboard** podrá agruparse por ellos.

Cada grupo se crea/edita en una ventana con dos campos: **label** (nombre) y **color**.

---

## 3. Members

Define **quién participa** y con qué rol. Por cada rol se gestiona una lista de usuarios:

| Rol | Permite… |
|-----|----------|
| **Administradores** | Editar cualquier parámetro del concurso (además de todo lo de abajo) |
| **Jueces** (*managers*) | Ver el código de los envíos y rejuzgar |
| **Concursantes** (*participants*) | Enviar soluciones y aclaraciones |
| **Invitados** (*guests*) | Ver el concurso y registrarse |
| **Espectadores** (*spectators*) | Solo ver el concurso |

### Tipo de acceso

El tipo de acceso del concurso determina la base de quién puede verlo:

| Acceso | Significado |
|--------|-------------|
| **PRIVATE** | Solo el propietario es administrador; no se pueden asignar otros miembros |
| **RESTRICTED** | El propietario es administrador; se pueden asignar todos los roles |
| **PUBLIC** | Todos los usuarios son espectadores; se asignan administradores, jueces, concursantes e invitados |
| **EXPOSED** | Todos los usuarios son espectadores **y jueces**; se asignan administradores, concursantes e invitados |

---

## 4. Problems

Aquí se eligen y configuran los problemas del concurso. Arriba hay tres interruptores de
reglas globales, y abajo la tabla de problemas.

### Reglas globales

**Restricción de tiempo por problema** — permite que cada problema tenga su propia ventana
de tiempo, distinta de la del concurso. Tres modos:
- *No* — todos los problemas usan el horario del concurso.
- *Minutos* — defines inicio/fin de cada problema en minutos desde el inicio del concurso.
- *Fecha* — defines inicio/fin de cada problema con fecha y hora.

**Restricción por prerrequisitos** — un problema se desbloquea solo cuando se resuelve el
anterior. Al activarla se configura:
- *La condición se cumple* → **por cualquier participante** (basta que alguien resuelva el
  problema previo) o **individualmente por usuario** (cada usuario debe resolverlo él mismo).
- *Habilitar problema tras* → **segundos** de espera después de cumplir el prerrequisito.

**Número máximo de envíos aceptados** — limita cuántos usuarios pueden obtener AC en un
problema (por ejemplo, problemas tipo "primero en resolver"). Al activarla, cada problema
recibe un campo *max users*.

### La tabla de problemas

Cada fila es un problema. Columnas:

| Columna | Descripción |
|---------|-------------|
| ⠿ | Tirador para **reordenar** los problemas arrastrando |
| **Index** | Letra del problema (A, B, C…), asignada automáticamente según el orden |
| **Id / Name** | Clave y nombre del problema (enlace al problema original) |
| 🎈 **Color** | Color del "globo" del problema (se autoasigna, se puede cambiar) |
| **Points** | Puntos que vale el problema (mínimo 1) |
| **Duration** | Inicio/fin propios del problema *(solo si activaste la restricción de tiempo)* |
| **Prerequisites** | Problema previo requerido *(solo si activaste prerrequisitos)* |
| **Max users** | Máximo de usuarios que pueden resolverlo *(solo si activaste ese límite)* |
| **Group** | Grupo del concurso al que pertenece *(solo si definiste grupos)* |
| 🗑️ | Eliminar el problema del concurso |

### Añadir problemas

En la última fila de la tabla hay un **selector de problemas**. Búscalo, selecciónalo y se
añade al final con un color y un índice asignados automáticamente, y 1 punto por defecto.

---

## Guardar

Pulsa el botón de **guardar** en la barra superior. Al crear, el concurso se registra y te
lleva a su vista. Validaciones a tener en cuenta antes de guardar:

- ✅ El concurso tiene **nombre**.
- ✅ Hay **al menos un lenguaje** seleccionado.
- ✅ Las fechas son coherentes (`inicio ≤ congelado ≤ silencioso ≤ fin`).

---

## Editar y eliminar

- Para **editar** un concurso existente, ábrelo y pulsa **Edit** (solo administradores).
  Es el mismo formulario.
- Al editar aparece la pestaña **Delete**, que permite **archivar** el concurso.
- Desde la vista de un concurso, el botón **Copy** crea un concurso nuevo a partir de uno
  existente, con toda su configuración precargada.

---

### Siguiente

- Aprende a crear los problemas que pondrás dentro → [Crear un problema](./05-crear-problema.md)
- Repasa la vista resultante → [Concursos](./01-concursos.md)
