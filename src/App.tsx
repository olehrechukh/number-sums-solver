import Grid from './components/Grid';
import gridConfig from './gridConfig.json';
import { GridModelRaw, GridModel } from './GridModel';
import { reduceHigherValues, reduceCombinations, selectSumValues, selectUniqueSumValues, SolutionFunction } from './solutionResolver';
import './App.css'


function initializeGridModel(rawModel: GridModelRaw): GridModel {
  return {
    grid: rawModel.grid.map(row => row.map(value => ({ value, hidden: false, solved: false }))),
    rowSums: rawModel.rowSums,
    columnSums: rawModel.columnSums,
    title: "original"
  };
}

function App() {

  const solutionGrids: GridModel[] = [];
  const solutions: SolutionFunction[] = [reduceHigherValues, reduceCombinations, selectSumValues, selectUniqueSumValues];

  let gridModel = initializeGridModel(gridConfig);

  solutionGrids.push(gridModel);

  let solved = false;

  for (let index = 0; index < 10 && !solved; index++) {
    let modified = false;
    for (const solution of solutions) {

      const result = solution(gridModel);

      gridModel = result.value;
      gridModel.title = solution.name + " [" + (index + 1) + "]";

      modified = modified || result.modified;

      solutionGrids.push(gridModel);

      // Check if the task has been solved
      if (gridModel.columnSums.every(x => x === 0) && gridModel.rowSums.every(x => x === 0) && gridModel.grid.flatMap(x => x).every(x => x.hidden || x.solved)) {
        solved = true;
        break;
      }
    }


    if (!modified) {
      console.error("No solution found");
      break;
    }
  }


  return (
    <div className="app">

      {solutionGrids.map((grid, index) => <Grid {...grid} key={index} />)}
    </div>
  );
}

export default App
