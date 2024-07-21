export interface GridModelRaw {
  grid: number[][];
  rowSums: number[];
  columnSums: number[];
}

export interface GridValue
{
  value: number;
  hidden: boolean;
  solved: boolean;
}

export interface GridModel {
  grid: GridValue[][];
  rowSums: number[];
  columnSums: number[];
  title: string
}