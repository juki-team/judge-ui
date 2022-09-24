import { EditCreateContestDTO, ProgrammingLanguage } from 'types';

export const CONTEST_DEFAULT = (): EditCreateContestDTO => {
  const now = (new Date(Date.now() + 1000 * 60 * 5));
  now.setSeconds(0, 0);
  
  return {
    key: '',
    name: '',
    description: `# \\textAlign=center Bienvenido

\\textAlign=center
Este concurso esta enfocado para estudiantes de primer año de Informática o carreras afines.

## Contenido

\\textAlign=justify
En este concurso podras encontrar problemas de Grafos y Estructura de Datos. Para tener un buen desepeño en el concurso necesitarás conocimientos en:

* [Segment Tree](https://cp-algorithms.com/data_structures/segment_tree.html)
* Fenwick Tree
* BFS
* DFS
* Algoritmo de Dijkstra [🔗](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm)

## Modalidad

El Contest durara $5$ horas y sera formato ICPC.
> The International Collegiate Programming Contest is an algorithmic programming contest for college students

![contest](https://images.juki.pub/o/juki-laptop.svg)

## Personal

Nombre | Rol
-- | --
Juki | Admin
Alberto Jimenez | Juez
Fernando Savedra | Staff
Oscar Arias | Problem Setter`,
    problems: {},
    settings: {
      clarifications: true,
      numberJudgeValidations: 0,
      languages: [ProgrammingLanguage.CPP17, ProgrammingLanguage.JAVA, ProgrammingLanguage.PYTHON3],
      penalty: 20,
      timeToSolve: 0,
      startTimestamp: now.getTime(),
      frozenTimestamp: now.getTime() + 1000 * 60 * 60 * 5 - 60 * 60 * 1000,
      quietTimestamp: now.getTime() + 1000 * 60 * 60 * 5 - 15 * 60 * 1000,
      endTimestamp: now.getTime() + 1000 * 60 * 60 * 5,
    },
    members: { administrators: [], judges: [], guests: ['*'], spectators: ['*'] },
    tags: [],
  };
};