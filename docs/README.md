# Documentación · Juki Judge

**Juki Judge** es un juez en línea (*online judge*) para programación competitiva: permite
publicar problemas, organizar concursos, enviar soluciones y evaluarlas automáticamente.

Esta carpeta documenta **qué es cada sección** de la aplicación y **cómo usarla**, con guías
paso a paso para crear concursos y problemas.

---

## Índice

| # | Documento | Contenido |
|---|-----------|-----------|
| 📄 | [Visión general](#visión-general) | Qué hace la app, secciones y navegación |
| 1 | [Concursos](./01-concursos.md) | Qué es un concurso, estados, plantillas y vista del concurso |
| 2 | [Problemas](./02-problemas.md) | Qué es un problema, jueces, veredictos y modos de puntaje |
| 3 | [IDE](./03-ide.md) | El editor de código integrado |
| 4 | [Crear un concurso](./04-crear-concurso.md) | Guía paso a paso y cada parámetro de configuración |
| 5 | [Crear un problema](./05-crear-problema.md) | Guía paso a paso y cada parámetro de configuración |

---

## Visión general

Juki Judge está construido con **Next.js 16** y **React 19**, sobre los paquetes
`@juki-team/base-ui` (componentes de interfaz) y `@juki-team/commons` (tipos y utilidades
compartidas). La comunicación con el backend se hace contra los *Juki Services*.

### Secciones principales

La aplicación se organiza en cuatro secciones accesibles desde el menú lateral:

| Sección | Ruta | Para qué sirve |
|---------|------|----------------|
| 🏆 **Concursos** | `/contests` | Competencias con tiempo, reglas y un conjunto de problemas |
| 📋 **Problemas** | `/problems` | Catálogo de problemas, agrupados por juez |
| 📊 **Ranking** | `/ranking` | Clasificación global de usuarios *(solo en la organización Juki)* |
| 💻 **IDE** | `/ide` | Editor de código para practicar y ejecutar sin enviar a un problema |

> Existen además páginas de **perfil** (`/profiles/...`) y de **envío individual**
> (`/submissions/...`) a las que se llega desde el resto de la interfaz.

### Conceptos clave

- **Problema** — una tarea individual: enunciado, casos de prueba y límites. Es la unidad
  mínima evaluable. Ver [Problemas](./02-problemas.md).
- **Concurso** — una colección de problemas con una ventana de tiempo, reglas de puntaje y
  roles de participación (administrador, juez, concursante, etc.). Ver [Concursos](./01-concursos.md).
- **Envío (*submission*)** — el código que un usuario manda para un problema; el juez lo
  ejecuta contra los casos de prueba y le asigna un **veredicto**.
- **Juez (*judge*)** — la fuente de un problema. Puede ser **interno** (`juki-judge`) o
  **externo** (Codeforces, LeetCode, etc.).

### Permisos

No todos los usuarios ven lo mismo. Crear concursos o problemas depende de permisos
asignados a la cuenta (`permissions.contests.create`, `permissions.problems.create`). Si no
los tienes, los botones de **Crear** no aparecen y las rutas `/new` muestran *página no
encontrada*.

---

## Cómo leer esta documentación

- ¿Quieres **entender** la plataforma? Empieza por [Concursos](./01-concursos.md) y
  [Problemas](./02-problemas.md).
- ¿Vas a **organizar una competencia**? Ve directo a [Crear un concurso](./04-crear-concurso.md).
- ¿Vas a **proponer un problema**? Ve a [Crear un problema](./05-crear-problema.md).