# 5 · Crear un problema

> Ruta `/problems/new` — requiere el permiso `problems.create`

Esta guía recorre **paso a paso** la creación de un problema y explica **cada parámetro** de
cada pestaña de configuración.

---

## Antes de empezar

- Necesitas permiso para crear problemas. Si no lo tienes, el botón **Crear** no aparece.
- Los problemas se crean en el **juez interno** (`juki-judge`). Los problemas de jueces
  externos no se crean: se **importan** con el botón *Crawl* desde la lista de problemas.
- El formulario está dividido en **pestañas**; los cambios se conservan al moverte entre ellas.
- El campo **Nombre** está siempre visible arriba, fuera de las pestañas.

### Orden recomendado

1. Escribe el **Nombre**.
2. Configura **Settings** (modo de puntaje, tipo y límites): conviene fijarlo antes del
   enunciado, porque algunos campos del enunciado dependen del modo de puntaje.
3. Redacta el **Statement** (enunciado).
4. Define el **Access** (acceso) y, si quieres, el **Editorial**.
5. **Guarda** el problema.
6. Vuelve a **Test cases** y sube los casos de prueba.

> ⚠️ La pestaña **Test cases** solo está disponible **después** de haber creado el problema.
> Antes de guardar, esa pestaña muestra un aviso en lugar del formulario.

---

## Pestañas

Al **crear** verás: **Statement**, **Settings**, **Test cases**, **Editorial** y **Access**.
Al **editar** un problema existente aparece además **Delete**.

---

## 1. Statement (enunciado)

El editor del enunciado, con un panel de IA a la derecha que ayuda a redactarlo.

### Idioma y formato

- **Idioma** — pestañas **Español** / **English**. El enunciado se redacta por separado en
  cada idioma.
- **Formato** — selector:
  - **Markdown** — para problemas del juez interno (recomendado).
  - **PDF** — sube un archivo PDF como enunciado.
  - **HTML** — disponible para problemas de jueces externos.

### Secciones del enunciado (Markdown)

| Sección | Contenido |
|---------|-----------|
| **Description** | Planteamiento del problema |
| **Input** | Formato de la entrada |
| **Output** | Formato de la salida |
| **Subtasks description** | Descripción de cada subtarea *(solo si el modo de puntaje es Subtask)* |
| **Sample cases** | Casos de ejemplo: pares entrada/salida visibles para el usuario |
| **Note** | Notas o aclaraciones sobre los ejemplos |

Cada bloque admite Markdown + fórmulas matemáticas, texto plano y subida de imágenes. Los
casos de ejemplo se añaden uno a uno con el botón **+**.

### Herramientas de apoyo

- **Historial** — botones de **deshacer / rehacer** los cambios del enunciado.
- **Redactor IA** — panel lateral de chat que ayuda a escribir y mejorar la redacción del
  enunciado.

### Formato PDF

Sube un archivo PDF; queda asociado al idioma seleccionado y se muestra incrustado.

---

## 2. Settings (configuración)

### Shortname (nombre corto)

Identificador corto del problema, para mostrarlo de forma compacta (p. ej. dentro de un
concurso).

### Problem scoring mode (modo de puntaje)

Cómo se combinan los casos de prueba para dar el veredicto. Tres opciones:

| Modo | Resumen |
|------|---------|
| **Total** | Todo o nada: AC solo si todos los casos pasan |
| **Subtask** | Casos agrupados; un grupo puntúa solo si **todos** sus casos pasan |
| **Partial** | Casos agrupados; puntúa **cada caso** que pasa |

Detalle completo en [Problemas → Modos de puntaje](./02-problemas.md#modos-de-puntaje).

### Points by groups (puntos por grupos)

Solo para los modos **Subtask** y **Partial**. Aquí se definen los grupos y su puntaje:

- Cada grupo tiene un número y un puntaje (*subtask points* o *partial points*).
- Se añaden grupos con **+ add group** y se eliminan con el ícono de papelera.
- Se muestra el **total** acumulado.
- El **grupo 0** es fijo: corresponde a los casos de ejemplo y **no otorga puntaje**.

### Problem type (tipo de problema)

| Tipo | Descripción |
|------|-------------|
| **Standard** | La salida se compara directamente con la esperada |
| **Dynamic** | La salida la valida un **evaluador** propio del problema |

### Evaluator source (código del evaluador)

Solo aparece si el tipo es **Dynamic**. Abre un editor donde se escribe y guarda el código
del **evaluador / checker** (en C++) que decide si una salida es válida.

### Time limit (límite de tiempo)

Tiempo máximo de ejecución **por caso de prueba**, en **milisegundos**.
Valor por defecto: **1000 ms**.

### Memory limit (límite de memoria)

Memoria máxima **por caso de prueba**, en **KB**.
Valor por defecto: **256000 KB** (≈ 256 MB).

### Presentation error (error de presentación)

Interruptor: define si el problema distingue el veredicto **PE** (salida correcta pero mal
formateada) o si una salida mal formateada se cuenta directamente como incorrecta.

### Limits by programming language (límites por lenguaje)

Permite **sobrescribir** el tiempo y la memoria para lenguajes concretos (por ejemplo, dar
más tiempo a Python). Se eligen los lenguajes en el selector y se ajustan sus límites en la
tabla. Los lenguajes sin override usan los límites generales.

### Author (autor)

Nombre del autor o *problem setter* del problema.

### Tags (etiquetas)

Etiquetas temáticas del problema (p. ej. "grafos", "dp"). Para **añadir etiquetas nuevas** a
la lista disponible hay que contactar al administrador.

---

## 3. Test cases (casos de prueba)

> Disponible **solo después de crear el problema**.

Aquí se suben las entradas y salidas reales contra las que se evalúa cada envío.

### Cómo se emparejan los archivos

- Se suben **archivos de entrada** y **archivos de salida** por separado.
- El nombre del archivo, **sin la extensión**, es la **clave del caso** (*test case key*).
  Así, `01.in` y `01.out` forman el caso `01`.

### Grupos

Si el modo de puntaje es **Subtask** o **Partial**, a cada caso se le asignan uno o más
**grupos**. Hay un selector de grupos por caso, y un selector de grupos por defecto que se
aplica solo a casos nuevos.

### Acciones disponibles

| Acción | Efecto |
|--------|--------|
| **Upload / replace files** | Sube los archivos locales pendientes al servidor |
| **Reload test cases** | Recarga desde el servidor (descarta cambios locales) |
| **Download all test cases** | Descarga todos los casos en un `.zip` |
| **Delete all test cases** | Elimina todos los casos *(acción irreversible)* |

Cada caso muestra el tamaño del archivo **en el servidor** y el del archivo **local** aún sin
guardar, y permite ver, descargar o eliminar cada archivo.

---

## 4. Editorial

El **editorial** es la explicación de la solución del problema. Es un editor de texto por
idioma (Español / English). Es opcional, pero recomendable para fines didácticos.

---

## 5. Access (acceso)

Define **quién puede ver y administrar** el problema. Por cada rol se gestiona una lista de
usuarios:

| Rol | Permite… |
|-----|----------|
| **Administradores** | Editar enunciado, configuración, casos de prueba, editorial y acceso |
| **Jueces** (*managers*) | Ver el código de los envíos del problema (además de lo que ve un *viewer*) |
| **Espectadores** (*viewers*) | Ver el problema y enviar sus soluciones |

### Tipo de acceso

| Acceso | Significado |
|--------|-------------|
| **PRIVATE** | Solo el propietario es administrador; no se asignan otros miembros |
| **RESTRICTED** | El propietario es administrador; se pueden asignar administradores, jueces y espectadores |
| **PUBLIC** | Todos los usuarios son espectadores; se asignan administradores y jueces |
| **EXPOSED** | Todos los usuarios son espectadores **y jueces**; se asignan administradores |

---

## Guardar

Pulsa **guardar** en la barra superior. Al crear, el problema se registra y te lleva a su
vista. Recuerda:

- ✅ El problema tiene **nombre** y **enunciado**.
- ✅ Si el modo es **Subtask** o **Partial**, los **grupos de puntaje** están definidos.
- ✅ Después de guardar, **sube los casos de prueba** en la pestaña *Test cases*.

---

## Editar y eliminar

- Para **editar** un problema, ábrelo y pulsa **Edit** (solo administradores). Es el mismo
  formulario, ya con la pestaña *Test cases* habilitada.
- Al editar aparece la pestaña **Delete**, que permite **archivar** el problema.

---

### Siguiente

- Pon tus problemas dentro de una competencia → [Crear un concurso](./04-crear-concurso.md)
- Repasa cómo se ve un problema publicado → [Problemas](./02-problemas.md)
