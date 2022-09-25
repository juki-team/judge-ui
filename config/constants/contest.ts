import { ContestStatus } from '@juki-team/commons';
import { ContestTemplate, EditCreateContest, ProgrammingLanguage } from 'types';

export const FIVE_HOURS = 1000 * 60 * 60 * 5;
export const ONE_HOUR = 1000 * 60 * 60;
export const FIFTEEN_MINUTES = 1000 * 60 * 15;

export const CONTEST_DEFAULT = (): EditCreateContest => {
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
      frozenTimestamp: now.getTime() + FIVE_HOURS - ONE_HOUR,
      quietTimestamp: now.getTime() + FIVE_HOURS - FIFTEEN_MINUTES,
      endTimestamp: now.getTime() + FIVE_HOURS,
    },
    members: { administrators: [], judges: [], guests: ['*'], spectators: ['*'] },
    tags: [],
    status: ContestStatus.PUBLIC,
  };
};

export const MAX_DATE = new Date(8640000000000000);
export const MIN_DATE = new Date(0);

export const CONTEST_TEMPLATE: { [key in ContestTemplate]: { value: ContestTemplate, label: string, description: string } } = {
  [ContestTemplate.CUSTOM]: { value: ContestTemplate.CUSTOM, label: 'custom', description: 'custom' },
  [ContestTemplate.CLASSIC]: { value: ContestTemplate.CLASSIC, label: 'classic', description: 'classic' },
  [ContestTemplate.ENDLESS]: { value: ContestTemplate.ENDLESS, label: 'endless', description: 'endless' },
};
