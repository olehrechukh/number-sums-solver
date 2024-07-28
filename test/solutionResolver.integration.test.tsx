import { test } from 'vitest'
import { solveUniqueSumValues, hideHigherValues, hideCombinations, solveSumValues, SolutionFunction } from '../src/solutionSolver';
import gridConfig from './data/gridConfig.json';

import { GridModel, GridModelRaw } from '../src/GridModel';

test('integration test/gridConfig.json', () => {
    const gridModel = initializeGridModel(gridConfig);
    checkSolution(gridModel);
});


const checkSolution = (gridModel: GridModel) => {
    const solutions: SolutionFunction[] = [hideHigherValues, hideCombinations, solveSumValues, solveUniqueSumValues];

    let solved = false;

    let index = 0;

    while (!solved) {
        let modified = false;

        for (const solution of solutions) {
            const result = solution(gridModel);

            gridModel = result.value;
            modified = modified || result.modified;

            // Check if the task has been solved
            if (gridModel.columnSums.every(x => x === 0) && gridModel.rowSums.every(x => x === 0) && gridModel.grid.flatMap(x => x).every(x => x.hidden || x.solved)) {
                solved = true;
                break;
            }
        }

        if (!modified || index === 9) {
            throw new Error("No solution found")
        }

        index++;
    }
}

const initializeGridModel = (rawModel: GridModelRaw): GridModel => {
    return {
        grid: rawModel.grid.map(row => row.map(value => ({ value, hidden: false, solved: false }))),
        rowSums: rawModel.rowSums,
        columnSums: rawModel.columnSums,
        title: "original"
    };
}