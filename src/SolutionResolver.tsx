import { GridModel, GridValue } from './GridModel';

export type SolutionFunction = (input: GridModel) => GridModelResult;
export interface GridModelResult { value: GridModel; modified: boolean; }


export const reduceHigherValues: SolutionFunction = (props) => {
  const gridModel = structuredClone(props);
  const { grid, rowSums, columnSums } = gridModel;
  let modified = false;

  for (let row = 0; row < grid.length; row++) {
    const rowSum = rowSums[row];

    for (let column = 0; column < grid[row].length; column++) {
      const columnSum = columnSums[column];

      const cell = grid[row][column];
      if (!isCompleted(cell) && (cell.value > rowSum || cell.value > columnSum)) {
        cell.hidden = true;
        modified = true;
      }
    }
  }

  gridModel.title = 'reduceHigherValues';
  return { value: gridModel, modified };
}

export const reduceCombinations: SolutionFunction = (props) => {
  const gridModel = structuredClone(props);
  const { grid } = gridModel;
  let modified = false;

  const redundantXRows = getRedundantNumberX(gridModel);

  for (let row = 0; row < grid.length; row++) {
    const rows = redundantXRows.get(row);

    if (rows != undefined) {
      for (let column = 0; column < grid[row].length; column++) {
        const cell = grid[row][column];
        if (rows.includes(cell.value) && !isCompleted(cell)) {
          cell.hidden = true;
          modified = true;
        }
      }
    }
  }

  const redundantYRows = getRedundantNumberY(gridModel);
  for (let column = 0; column < grid.length; column++) {
    const columns = redundantYRows.get(column);

    if (columns == undefined) {
      continue;
    }

    for (let row = 0; row < grid[column].length; row++) {

      const cell = grid[row][column];
      if (columns.includes(cell.value) && !isCompleted(cell)) {
        cell.hidden = true;
        modified = true;
      }
    }
  }

  gridModel.title = 'reduceCombinations';
  return { value: gridModel, modified };
}

export const checkSum: SolutionFunction = (props) => {
  const gridModel = structuredClone(props);
  const { grid, rowSums, columnSums } = gridModel;
  let modified = false;

  for (let row = 0; row < grid.length; row++) {
    const rowSum = rowSums[row];
    const calculatedRowSum = grid[row].filter(x => !isCompleted(x)).reduce((sum, current) => sum + current.value, 0);

    if (calculatedRowSum === rowSum) {
      for (let column = 0; column < grid[row].length; column++) {
        const cell = grid[row][column];
        if (!isCompleted(cell)) {
          cell.solved = true;
          rowSums[row] -= cell.value;
          columnSums[column] -= cell.value;

          modified = true;
        }
      }
    }

    const columnSum = columnSums[row];
    const columnValues = gridModel.grid.map(x => x[row]).filter(x => !isCompleted(x)).reduce((sum, current) => sum + current.value, 0);


    if (columnSum === columnValues) {
      for (let column = 0; column < grid[row].length; column++) {
        const cell = grid[column][row];
        if (!isCompleted(cell)) {
          cell.solved = true;
          columnSums[row] -= cell.value;
          rowSums[column] -= cell.value;
          modified = true;
        }
      }
    }
  }

  gridModel.title = 'checkSum';
  return { value: gridModel, modified };
}

function getRedundantNumberX(gridModel: GridModel): Map<number, number[]> {
  const map: Map<number, number[]> = new Map<number, number[]>();

  for (let row = 0; row < gridModel.grid.length; row++) {

    const rowValues = gridModel.grid[row].filter(x => !isCompleted(x));
    const combinations = generateCombinations(rowValues);
    const rowValue = gridModel.rowSums[row];

    const possibleNumbers = combinations.filter((x) => x.reduce((sum, current) => sum + current, 0) === rowValue).flatMap(x => x).filter(onlyUnique);

    const uniqueRowValues = rowValues.map(x => x.value).filter(onlyUnique);
    if (uniqueRowValues.length != possibleNumbers.length) {

      map.set(row, uniqueRowValues.filter(value => !possibleNumbers.includes(value)));
    }
  }

  return map;
}

function getRedundantNumberY(gridModel: GridModel): Map<number, number[]> {
  const map: Map<number, number[]> = new Map<number, number[]>();

  for (let row = 0; row < gridModel.grid.length; row++) {

    const columnValues = gridModel.grid.map(x => x[row]).filter(x => !isCompleted(x));
    const combinations = generateCombinations(columnValues);
    const rowValue = gridModel.columnSums[row];

    const possibleNumbers = combinations.filter((x) => x.reduce((sum, current) => sum + current, 0) === rowValue).flatMap(x => x).filter(onlyUnique);

    const uniqueRowValues = columnValues.map(x => x.value).filter(onlyUnique);
    if (uniqueRowValues.length != possibleNumbers.length) {

      map.set(row, uniqueRowValues.filter(value => !possibleNumbers.includes(value)));
    }
  }

  return map;
}

function generateCombinations(values1: GridValue[]): number[][] {
  const result: number[][] = [];

  const values = values1.map(x => x.value).sort();

  // There are 2^n possible subsets excluding the empty subset, hence we iterate from 1 to 2^n - 1
  const totalCombinations = 1 << values.length; // This is 2^n

  for (let i = 1; i < totalCombinations; i++) {
    const subset: number[] = [];
    for (let j = 0; j < values.length; j++) {
      // Check if the j-th element is included in the i-th subset
      if (i & (1 << j)) {
        subset.push(values[j]);
      }
    }

    result.push(subset);
  }

  return result;
}

function onlyUnique(value: number, index: number, array: number[]): boolean {
  return array.indexOf(value) === index;
}

const isCompleted = (value: GridValue): boolean => {
  return value.hidden || value.solved;
}