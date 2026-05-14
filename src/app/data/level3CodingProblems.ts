import type { Level3CodingProblem } from '../services/contracts';
import { level3CodingProblems } from '../../../shared/level3CodingProblems.js';

export const level3CodingProblemsTyped: Level3CodingProblem[] =
  level3CodingProblems as Level3CodingProblem[];

export { level3CodingProblems };
