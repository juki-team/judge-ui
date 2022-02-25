export interface TestCase {
  id: string,
  group: number,
  input: boolean,
  output: boolean,
}

export enum TypeTestCase {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT'
}
