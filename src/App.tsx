import Grid from './components/Grid';
import gridConfig from './gridConfig.json';
import { GridModelRaw, GridModel } from './GridModel';
import { reduceHigherValues as reduceHigherValuesAlgo, reduceCombinations as reduceCombinationsAlgo, checkSum as checkSumAlgo, SolutionFunction as SolutionAlgo } from './SolutionResolver';
import './App.css'


function convertGridModel(rawModel: GridModelRaw): GridModel {
  return {
    grid: rawModel.grid.map(row => row.map(value => ({ value, hidden: false, solved: false }))),
    rowSums: rawModel.rowSums,
    columnSums: rawModel.columnSums,
    title: "original"
  };
}

function App() {

  const solutionGrids: GridModel[] = [];
  const solutions: SolutionAlgo[] = [reduceHigherValuesAlgo, reduceCombinationsAlgo, checkSumAlgo];

  let grid = convertGridModel(gridConfig);

  solutionGrids.push(grid);

  let solved = false;

  for (let index = 0; index < 10 && !solved; index++) {
    let modified = false;
    for (const solution of solutions) {

      const result = solution(grid);
      grid = result.value;
      grid.title += index + 1;

      modified = modified || result.modified;

      solutionGrids.push(grid);

      // Check if the task has been solved
      if (grid.columnSums.every(x => x === 0) && grid.columnSums.every(x => x === 0)) {
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
