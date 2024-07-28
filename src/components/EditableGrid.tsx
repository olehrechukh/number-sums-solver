import React, { useState } from 'react';
import { GridModelRaw } from '../GridModel';
import { Tooltip } from 'react-tooltip';
import { MdDelete } from "react-icons/md";

import './EditableGrid.css';

interface EditableGridProps {
  data: GridModelRaw;
  onChange: (newData: GridModelRaw) => void;
}

const EditableGrid: React.FC<EditableGridProps> = (props) => {
  const data = props.data;
  const [grid, setGrid] = useState(data.grid);
  const [rowSums, setRowSums] = useState(data.rowSums);
  const [columnSums, setColumnSums] = useState(data.columnSums);
  // const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const addRow = () => {
    const newRowSums = [...rowSums];
    const newGrid = [...grid];

    newRowSums.push(0);
    newGrid.push(Array<number>(columnSums.length).fill(0));

    setRowSums(newRowSums);
    setGrid(newGrid);
  };

  const addColumn = () => {
    const newColumnSums = [...columnSums];
    const newGrid = [...grid];

    newColumnSums.push(0);
    newGrid.forEach(element => {
      element.push(0);
    });

    setColumnSums(newColumnSums);
    setGrid(newGrid);
  };

  const handleCellChange = (rowIndex: number, colIndex: number, value: number) => {
    const newGrid = [...grid];
    newGrid[rowIndex][colIndex] = value;
    setGrid(newGrid);
  };

  const handleRowSumChange = (rowIndex: number, value: number) => {
    const newRowSums = [...rowSums];
    newRowSums[rowIndex] = value;

    setRowSums(newRowSums);
  };

  const handleColumnSumChange = (colIndex: number, value: number) => {
    const newColumnSums = [...columnSums];
    newColumnSums[colIndex] = value;
    setColumnSums(newColumnSums);
  };

  const handleDeleteRow = (rowIndex: number) => {
    const newRowSums = [...rowSums].filter((_, index) => rowIndex != index);
    const newGrid = [...grid].filter((_, index) => rowIndex != index);

    setRowSums(newRowSums);
    setGrid(newGrid);
  };

  const handleDeleteColumn = (columnIndex: number) => {
    const newColumnSums = [...columnSums].filter((_, index) => columnIndex != index);
    const newGrid = [...grid].map(x => x.filter((_, index) => columnIndex != index));

    setColumnSums(newColumnSums);
    setGrid(newGrid);
  };

  const parse = (value: string | null): number => {
    if (value === null) {
      return -1;
    }

    return parseInt(value);
  }

  return (
    <div className='form-container'>
      <div className="grid-container">
        <div className="empty-corner"></div>
        <div className="column-sums">
          {columnSums.map((sum, columnIndex) => (
            <input key={columnIndex}
              className="column-sum"
              data-tooltip-place="top"
              data-tooltip-id="delete-column"
              data-tooltip-content={columnIndex + ""} 
              type="number" 
              value={sum}
              onChange={(e) => handleColumnSumChange(columnIndex, parseInt(e.target.value))}
            />
          ))}
        </div>
        <div className="row-sums">
          {rowSums.map((sum, rowIndex) => (
            <div
              key={rowIndex}
              className="row-sum-container">
              <input
                className="row-sum"
                data-tooltip-place="right"
                data-tooltip-id="delete-row"
                data-tooltip-content={rowIndex + ""}
                type="number"
                value={sum}
                onChange={(e) => handleRowSumChange(rowIndex, parseInt(e.target.value))}
              />
            </div>
          ))}
        </div>
        <div className="grid">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="grid-row">
              {row.map((cell, cellIndex) => (
                <input key={cellIndex} className="grid-cell" type="number" value={cell}
                  onChange={(e) => handleCellChange(rowIndex, cellIndex, parseInt(e.target.value))} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => addRow()}>Add row</button>
      <button onClick={() => addColumn()}>Add column</button>
      <button className="save" onClick={() => props.onChange({ grid, rowSums, columnSums })}>Save</button>


      <Tooltip
        clickable
        id="delete-row"
        render={({ content }) => (
          <MdDelete onClick={() => handleDeleteRow(parse(content))}></MdDelete>
        )}
      />
      <Tooltip
        clickable
        id="delete-column"
        render={({ content }) => (
          <MdDelete onClick={() => handleDeleteColumn(parse(content))}></MdDelete>
        )}
      />
    </div>
  );
};

export default EditableGrid;
