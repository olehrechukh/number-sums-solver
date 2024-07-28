import { GridModel, GridValue } from './GridModel';

export type SolutionFunction = (input: GridModel) => GridModelResult;
export interface GridModelResult { value: GridModel; modified: boolean; }

/**
 * Hides grid values that are higher than their corresponding row or column sums.
 * 
 * @param {GridModel} props - The grid model containing the grid and sums.
 * @returns {GridModelResult} - The updated grid model with modifications flag.
 */
export const hideHigherValues: SolutionFunction = (props: GridModel): GridModelResult => {
  const gridModel = structuredClone(props);
  const { grid, rowSums, columnSums } = gridModel;
  let modified = false;

  grid.forEach((row, rowIndex) => {
    const rowSum = rowSums[rowIndex];

    row.forEach((cell, colIndex) => {
      const columnSum = columnSums[colIndex];
      if (!isCompleted(cell) && (cell.value > rowSum || cell.value > columnSum)) {
        cell.hidden = true;
        modified = true;
      }
    });
  });

  return { value: gridModel, modified };
};

/**
 * Hides redundant values in rows and columns based on all possible combinations and given sums.
 * 
 * @param {GridModel} props - The grid model containing the grid and sums.
 * @returns {GridModelResult} - The updated grid model with modifications flag.
 */
export const hideCombinations: SolutionFunction = (props: GridModel): GridModelResult => {
  const gridModel = structuredClone(props);
  const { grid } = gridModel;
  let modified = false;

  const hideRedundantValues = (values: GridValue[], redundantValues: number[]) => {
    values.forEach(cell => {
      if (redundantValues.includes(cell.value) && !isCompleted(cell)) {
        cell.hidden = true;
        modified = true;
      }
    });
  };

  const redundantRows = getRedundantNumbers(gridModel, 'rowSums');
  grid.forEach((row, rowIndex) => {
    const redundantValues = redundantRows.get(rowIndex);
    if (redundantValues) {
      hideRedundantValues(row, redundantValues);
    }
  });

  const redundantColumns = getRedundantNumbers(gridModel, 'columnSums');
  grid[0].forEach((_, colIndex) => {
    const columnValues = grid.map(row => row[colIndex]);
    const redundantValues = redundantColumns.get(colIndex);
    if (redundantValues) {
      hideRedundantValues(columnValues, redundantValues);
    }
  });

  return { value: gridModel, modified };
};

/**
 * Solves all values in rows or columns where the sum matches the given sums.
 * 
 * @param {GridModel} props - The grid model containing the grid and sums.
 * @returns {GridModelResult} - The updated grid model with modifications flag.
 */
export const solveSumValues: SolutionFunction = (props: GridModel): GridModelResult => {
  const gridModel = structuredClone(props);
  const { grid, rowSums, columnSums } = gridModel;
  let modified = false;

  grid.forEach((row, rowIndex) => {
    const rowSum = rowSums[rowIndex];
    const calculatedRowSum = calculateSum(row);

    if (calculatedRowSum === rowSum) {
      row.forEach(cell => {
        if (!isCompleted(cell)) {
          setSolved(gridModel, cell);

          modified = true;
        }
      });
    }

    const columnSum = columnSums[rowIndex];
    const columnValues = grid.map(x => x[rowIndex]);
    const calculatedColumnSum = calculateSum(columnValues);

    if (calculatedColumnSum === columnSum) {
      columnValues.forEach((cell) => {
        setSolved(gridModel, cell);

        modified = true;
      });
    }
  });

  return { value: gridModel, modified };
};

/**
 * Solves grid values by identifying and solving unique values that satisfy the row or column sums.
 * 
 * @param {GridModel} props - The grid model containing the grid and sums.
 * @returns {GridModelResult} - The updated grid model with modifications flag.
 */
export const solveUniqueSumValues: SolutionFunction = (props: GridModel): GridModelResult => {
  const gridModel = structuredClone(props);
  const { grid, rowSums, columnSums } = gridModel;
  let modified = false;

  const processValues = (values: GridValue[], targetSum: number) => {
    const incompleteValues = values.filter(cell => !isCompleted(cell));
    const combinations = generateCombinations(incompleteValues).filter(c => c.reduce((sum, current) => sum + current, 0) === targetSum);
    const intersections = findIntersectionItems(combinations);

    intersections.forEach((value, key) => {
      const intersectedValues = incompleteValues.filter(x => x.value === key);
      if (intersectedValues.length === value) {
        intersectedValues.forEach(cell => setSolved(gridModel, cell));
        modified = true;
      }
    });
  };

  grid.forEach((row, rowIndex) => {
    processValues(row, rowSums[rowIndex]);
  });

  grid[0].forEach((_, columnIndex) => {
    const columnValues = grid.map(row => row[columnIndex]);
    processValues(columnValues, columnSums[columnIndex]);
  });

  return { value: gridModel, modified };
};

const calculateSum = (values: GridValue[]): number =>
  values.filter(x => !isCompleted(x)).reduce((sum, current) => sum + current.value, 0);

const setSolved = (gridModel: GridModel, cell: GridValue) => {
  const [row, column] = findCellIndex(gridModel.grid, cell);

  if (isCompleted(cell)) {
    return;
  }

  cell.solved = true;

  gridModel.rowSums[row] -= cell.value;
  gridModel.columnSums[column] -= cell.value;
};

const findCellIndex = (gridModel: GridValue[][], cell: GridValue): [row: number, column: number] => {
  for (let rowIndex = 0; rowIndex < gridModel.length; rowIndex++) {
    for (let colIndex = 0; colIndex < gridModel[rowIndex].length; colIndex++) {
      if (gridModel[rowIndex][colIndex] === cell) {
        return [rowIndex, colIndex];
      }
    }
  }

  throw new RangeError();
};

const findIntersectionItems = (arrays: number[][]): Map<number, number> => {
  if (arrays.length === 0) return new Map();

  const countMaps: Map<number, number>[] = arrays.map(arr => {
    const map: Map<number, number> = new Map();
    arr.forEach(num => {
      map.set(num, (map.get(num) || 0) + 1);
    });
    return map;
  });

  const resultCountMap: Map<number, number> = new Map();

  countMaps[0].forEach((count, num) => {
    resultCountMap.set(num, count);
  });

  for (let i = 1; i < countMaps.length; i++) {
    const currentMap = countMaps[i];
    resultCountMap.forEach((count, num) => {
      if (currentMap.has(num)) {
        resultCountMap.set(num, Math.min(count, currentMap.get(num)!));
      } else {
        resultCountMap.delete(num);
      }
    });
  }

  return resultCountMap;
};

const getRedundantNumbers = (gridModel: GridModel, sumType: 'rowSums' | 'columnSums'): Map<number, number[]> => {
  const map: Map<number, number[]> = new Map<number, number[]>();

  gridModel.grid.forEach((_, index) => {
    const values = (sumType === 'rowSums' ? gridModel.grid[index] : gridModel.grid.map(x => x[index]))
      .filter(x => !isCompleted(x));
    const combinations = generateCombinations(values);
    const sumValue = sumType === 'rowSums' ? gridModel.rowSums[index] : gridModel.columnSums[index];
    const possibleNumbers = combinations.filter(x => x.reduce((sum, current) => sum + current, 0) === sumValue).flatMap(x => x).filter(onlyUnique);

    const uniqueValues = values.map(x => x.value).filter(onlyUnique);
    if (uniqueValues.length !== possibleNumbers.length) {
      map.set(index, uniqueValues.filter(value => !possibleNumbers.includes(value)));
    }
  });

  return map;
};

const generateCombinations = (values: GridValue[]): number[][] => {
  const result: number[][] = [];
  const nums = values.map(x => x.value).sort();
  const totalCombinations = 1 << nums.length;

  for (let i = 1; i < totalCombinations; i++) {
    const subset: number[] = [];
    for (let j = 0; j < nums.length; j++) {
      if (i & (1 << j)) {
        subset.push(nums[j]);
      }
    }
    result.push(subset);
  }

  return result;
};

const onlyUnique = (value: number, index: number, array: number[]): boolean => array.indexOf(value) === index;

const isCompleted = (value: GridValue): boolean => value.hidden || value.solved;