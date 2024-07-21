import React from 'react';
import './Grid.css';
import { GridModel } from '../GridModel';

const Grid: React.FC<GridModel> = (props) => {
  const { grid, rowSums, columnSums, title } = props;

  return (
    <div>
      <p>{title}</p>

      <div className="grid-container">
        <div className="empty-corner"></div>
        <div className="column-sums">
          {columnSums.map((sum, idx) => (
            <div key={idx} className="column-sum">{sum}</div>
          ))}
        </div>
        <div className="row-sums">
          {rowSums.map((sum, idx) => (
            <div key={idx} className="row-sum">{sum}</div>
          ))}
        </div>
        <div className="grid">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="grid-row">
              {row.map((cell, cellIndex) => (
                <div key={cellIndex} className={`grid-cell ${cell.hidden ? 'transparent' : ''} ${cell.solved ? 'solved' : ''}`} title={`Original value: ${cell.value}`}>{cell.value}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Grid;
