# 2 · Problemas

> Sección **Problemas** — ruta `/problems`

---

## ¿Qué es un problema?

Un **problema** (*problem*) es la unidad mínima evaluable de la plataforma: una tarea de
programación que un usuario resuelve enviando código. Cada problema tiene:

- un **enunciado** — descripción, formato de entrada, formato de salida, notas y casos de
  ejemplo;
- **casos de prueba** — las entradas/salidas reales contra las que se evalúa el código;
- **límites** — tiempo y memoria máximos por caso;
- un **modo de puntaje** que determina cómo se calcula el veredicto.

Cuando un usuario envía una solución, el juez la compila, la ejecuta contra todos los casos
de prueba y le asigna un **veredicto**.

---

## La lista de problemas

La página de problemas muestra el catálogo **agrupado por juez**. Un selector en la esquina
superior permite cambiar de juez.

### Jueces interno y externos

| Tipo | Ejemplos | Comportamiento |
|------|----------|----------------|
| **Interno** | `juki-judge` | Los problemas se crean, alojan y evalúan dentro de la plataforma |
| **Externo** | Codeforces, Codeforces Gym, LeetCode, jv-umsa | Los problemas viven en otra plataforma; aquí solo se *rastrean* |

> En jueces externos **solo se muestran los problemas ya rastreados**. Para incorporar uno
> nuevo se usa el botón **Crawl**, que importa el problema desde la plataforma de origen.

La tabla muestra, según el juez: clave, nombre, modo de puntaje, tipo, tipo de acceso y
etiquetas.

---

## La vista de un problema

Al abrir un problema (`/problems/{clave}`) se muestran tres pestañas:

### Statement (enunciado)
El enunciado del problema junto al **editor de código integrado**. Desde aquí se escribe la
solución y se **envía** con el botón *Submit*.

> **Límites de envío:** no se puede enviar más de **5 veces por minuto** ni **enviar dos
> veces el mismo código** seguido.

### Submissions (envíos)
Historial de envíos realizados al problema, con su veredicto y detalles.

### Statistics (estadísticas)
Gráficas e indicadores de actividad del problema (intentos, aceptados, etc.).

> Los administradores tienen además los botones **rejudge** (rejuzgar envíos) y **edit**.

---

## Veredictos

El resultado de un envío:

| Veredicto | Significado |
|-----------|-------------|
| **AC** | *Accepted* — solución correcta |
| **PA** | *Partially Accepted* — correcta parcialmente (modos subtask/partial) |
| **WA** | *Wrong Answer* — salida incorrecta |
| **TLE** | *Time Limit Exceeded* — superó el tiempo permitido |
| **MLE** | *Memory Limit Exceeded* — superó la memoria permitida |
| **RE** | *Runtime Error* — el programa falló en ejecución |
| **PE** | *Presentation Error* — salida correcta pero mal formateada |

---

## Modos de puntaje

El **modo de puntaje** (*scoring mode*) define cómo se combinan los resultados de los casos
de prueba para producir el veredicto final.

### Total
El modo más simple. Si **todos** los casos son **AC**, el resultado es **AC**. Si alguno
falla, el resultado es el primer error en este orden de prioridad: **RE → TLE → MLE → WA → PE**.

### Subtask (subtareas)
Los casos de prueba se **agrupan**, y cada grupo tiene un puntaje asignado.

- Si **todos** los casos de un grupo son AC, se suma el puntaje completo de ese grupo.
- Si el total alcanza la suma de todos los grupos → **AC**.
- Si el total es mayor que cero pero no completo → **PA** con el puntaje acumulado.
- Si es cero → el error correspondiente (RE/TLE/MLE/WA/PE).

### Partial (parcial)
Como subtask, pero el puntaje se otorga **por caso**, no por grupo completo.

- Cada caso AC suma el puntaje parcial de su grupo.
- Si el total alcanza la suma de todos los grupos → **AC**.
- Si es mayor que cero → **PA**; si es cero → el error correspondiente.

> El **grupo 0** siempre corresponde a los **casos de ejemplo** y **no otorga puntaje**.

---

## Tipos de problema

| Tipo | Descripción |
|------|-------------|
| **Standard** | La salida del programa se compara directamente con la salida esperada |
| **Dynamic** | La respuesta se valida con un **evaluador** (*checker*) propio del problema — útil cuando hay varias respuestas válidas |

---

### Siguiente

- ¿Vas a proponer un problema? → [Crear un problema](./05-crear-problema.md)
- Practica sin enviar a un problema → [IDE](./03-ide.md)
