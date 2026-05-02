import { ContestTemplate, UpsertContestDTOUI } from 'types';
import { type UserOrganizationBasicInfoResponseDTO as UserCompanyBasicInfoResponseDTO } from '@juki-team/commons/dto';
import { CodeLanguage, EntityState } from '@juki-team/commons/enums';
import { EMPTY_ENTITY_MEMBERS } from '@juki-team/commons/constants';

export const FIVE_HOURS = 1000 * 60 * 60 * 5;
export const ONE_HOUR = 1000 * 60 * 60;
export const FIFTEEN_MINUTES = 1000 * 60 * 15;

export const LS_INITIAL_CONTEST_KEY = 'jk-initial-contest';

export const CONTEST_DEFAULT = (owner: UserCompanyBasicInfoResponseDTO, initialContest?: Partial<UpsertContestDTOUI>): UpsertContestDTOUI => {
  const now = (new Date(Date.now() + 1000 * 60 * 5));
  now.setSeconds(0, 0);
  
  return {
    state: EntityState.RELEASED,
    owner,
    name: '',
    description: `# Bienvenido

Este concurso esta enfocado para estudiantes de primer año de Informática o carreras afines.

## Contenido

En este concurso podrás encontrar problemas de Grafos y Estructura de Datos. Para tener un buen desempeño en el concurso necesitarás conocimientos en:

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
Fernando Mendoza | Staff
Oscar Arias | Problem Setter`,
    problems: {},
    settings: {
      clarifications: true,
      numberJudgeValidations: 0,
      languages: [ CodeLanguage.C_11, CodeLanguage.CPP_20, CodeLanguage.JAVA_21, CodeLanguage.PYTHON_PYPY_3, CodeLanguage.JAVASCRIPT_NODE_JS_22 ],
      penalty: 20,
      timeToSolve: 0,
      startTimestamp: now.getTime(),
      frozenTimestamp: now.getTime() + FIVE_HOURS - ONE_HOUR,
      quietTimestamp: now.getTime() + FIVE_HOURS - FIFTEEN_MINUTES,
      endTimestamp: now.getTime() + FIVE_HOURS,
      scoreboardLocked: true,
      upsolvingEnabled: false,
    },
    members: EMPTY_ENTITY_MEMBERS(),
    tags: [],
    groups: {},
    ...initialContest,
  };
};

export const CONTEST_TEMPLATE: (isAdminServices: boolean) => ({
  value: ContestTemplate,
  label: string,
  description: string,
}[]) = (isAdminServices) => [
  { value: ContestTemplate.CUSTOMIZED, label: 'customized', description: 'customized' },
  { value: ContestTemplate.CLASSIC, label: 'classic', description: 'classic' },
  { value: ContestTemplate.ENDLESS, label: 'endless', description: 'endless' },
  ...(isAdminServices
    ? [ { value: ContestTemplate.GLOBAL, label: 'global', description: 'global' } ]
    : []),
];
