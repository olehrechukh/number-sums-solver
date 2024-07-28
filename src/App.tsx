import { useState } from 'react';
import { Modal } from 'react-responsive-modal';

import Grid from './components/Grid';
import EditableGrid from './components/EditableGrid';

import gridConfig from './gridConfig.json';

import { GridModelRaw, GridModel } from './GridModel';
import { hideHigherValues, hideCombinations, solveSumValues, solveUniqueSumValues, SolutionFunction } from './solutionSolver';
import { FaGear } from "react-icons/fa6";

import './App.css';
import 'react-responsive-modal/styles.css';

function initializeGridModel(rawModel: GridModelRaw): GridModel {
  return {
    grid: rawModel.grid.map(row => row.map(value => ({ value, hidden: false, solved: false }))),
    rowSums: rawModel.rowSums,
    columnSums: rawModel.columnSums,
    title: "original"
  };
}
function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [config, setConfig] = useState(gridConfig);

  const solutionGrids: GridModel[] = [];

  const solutions: SolutionFunction[] = [hideHigherValues, hideCombinations, solveSumValues, solveUniqueSumValues];

  let gridModel = initializeGridModel(config);

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
    <>
      <FaGear className='right' onClick={() => setModalOpen(true)}></FaGear>

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false) }} center>
        <EditableGrid data={structuredClone(gridConfig)} onChange={setConfig}></EditableGrid>

      </Modal>

      <div className="app" id='app'>
        {solutionGrids.map((grid, index) => <Grid {...grid} key={index} />)}
      </div>
    </>

  );
}

export default App
