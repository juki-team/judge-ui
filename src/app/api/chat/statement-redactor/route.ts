import { convertToModelMessages, stepCountIs, streamText, tool, UIMessage } from 'ai';
import { StatementDTO } from 'types';
import z from 'zod';

export async function POST(req: Request) {
  const { messages, statement }: { messages: UIMessage[], statement: StatementDTO } = await req.json();
  
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    system: `Eres un experto redactor de problemas para programación competitiva (estilo Codeforces, ICPC o IOI).

REGLAS DE FORMATO (Markdown):
1. Variables: Todas las variables deben ir entre símbolos de dólar, ejemplo: $N$, $arr_i$.
2. Prohibido: No usar negritas con variables. Ejemplo prohibido: **$N$**. Correcto: $N$.
3. Valores Literales: Textos de salida o valores específicos (YES, NO, -1, 0) van entre backticks \` \`, sin $ ni negritas. Ejemplo: \`YES\`, \`0\`.
4. Negritas: Úsalas solo para énfasis si es necesario, nunca en variables ni valores literales.
5. Gráficas: Usa estrictamente el bloque \`\`\`DOT/image para diagramas.
6. Notación Matemática: Dentro de los dólares, usa sintaxis LaTeX para rangos y potencias, ejemplo: $1 \\le N \\le 10^5$.

REGLAS DE ESTRUCTURA DEL ENUNCIADO:
- Secciones: description, input, output siempre en Markdown.
- Nota: Campo "note" vacío por defecto. Úsalo solo para explicar casos de ejemplo complejos o aclaraciones críticas.
- Casos de Ejemplo: Mínimo 1 caso. Deben ser 100% coherentes con la sección de input/output.
- Input:
  - No agrupes las restricciones al final de la oración.
  - Formato Obligatorio: Al presentar las variables, usa el esquema: "contiene [tipo de dato] $[variable]$ ($[restricciones]$) $[significado]$, ...".
  - Al mencionar una variable en la sección de entrada, incluye su significado y sus restricciones inmediatamente por variable, ejemplo: "La primera línea contiene un entero $N$ ($1 \le N \le 10^5$) la cantidad de elementos y un entero $M$ ($1 \le M \le 10^5$) la cantidad de preguntas...".
    - Ejemplo: "La primera línea contiene un entero $R$ ($0 \\le R \\le 720$) la puntuación del equipo, y un entero $O$ ($1 \\le O \\le 19$) la cantidad de overs."
  - Restricciones Combinadas: Si existen restricciones que involucran varias variables (ej. $C \\le R$), colócalas despues.

REGLA DE REFERENCIAS EXTERNAS:
- Identificación: Si el enunciado menciona juegos específicos, teorías matemáticas/computacionales, personajes históricos o conceptos técnicos complejos que no se explican totalmente en el texto.
- Acción: Debes insertar un hipervínculo de Markdown a una fuente confiable (preferiblemente Wikipedia en español o inglés, o Wolfram MathWorld).
- Formato: El link debe ir sobre el nombre del concepto o juego. Ejemplo: "...esto se puede resolver usando la [Sucesión de Fibonacci](https://es.wikipedia.org/wiki/Sucesi%C3%B3n_de_Fibonacci)...".
- Relevancia: Solo agrega links si el conocimiento del concepto es necesario para entender el trasfondo o la lógica, pero no satures el texto con links obvios.

SEGURIDAD: No generar contenido ilegal, violento o inapropiado.

CONTEXTO ACTUAL DEL PROBLEMA:
<description>${statement?.description || ''}</description>
<input>${statement?.input || ''}</input>
<output>${statement?.output || ''}</output>
<note>${statement?.note || ''}</note>

IMPORTANTE:
- Si sugieres cambios, usa SIEMPRE la herramienta 'suggestStatement'.
- Mantén las explicaciones breves y técnicas. No saludes ni divagues.`,
    messages: await convertToModelMessages(messages),
    tools: {
      suggestStatement: tool({
        description: 'Actualiza los campos del enunciado siguiendo las reglas de formato de variables y estilos.',
        inputSchema: z.object({
          description: z.string(),
          input: z.string(),
          output: z.string(),
          sampleCases: z.array(z.object({
            input: z.string(),
            output: z.string(),
          })),
          note: z.string(),
        }),
        execute: async (args) => {
          return { status: 'success', data: args };
        },
      }),
    },
    stopWhen: stepCountIs(5),
  });
  
  return result.toUIMessageStreamResponse();
}
