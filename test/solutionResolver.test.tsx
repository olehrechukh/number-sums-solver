import { expect, test } from 'vitest'
import { selectUniqueSumValues, reduceHigherValues, reduceCombinations, selectSumValues } from '../src/solutionResolver';
import { GridModel, GridValue } from '../src/GridModel';

const createGridValue = (value: number, hidden = false, solved = false): GridValue => ({ value, hidden, solved });

const createGridModel = (grid: GridValue[][], rowSums: number[], columnSums: number[]): GridModel => ({
    grid,
    rowSums,
    columnSums,
    title: ""
});

test('reduceHigherValues hides values greater than row or column sum', () => {
    const grid = [
        [createGridValue(5), createGridValue(2)],
        [createGridValue(4), createGridValue(6)]
    ];
    const rowSums = [5, 4];
    const columnSums = [4, 6];
    const input = createGridModel(grid, rowSums, columnSums);

    const { value, modified } = reduceHigherValues(input);

    const expected = createGridModel([
        [createGridValue(5, true), createGridValue(2)],
        [createGridValue(4), createGridValue(6, true)]
    ], rowSums, columnSums);

    expect(modified).toBe(true);
    expect(value).toEqual(expected);
});

test('solves unique value in a row correctly', () => {
    const grid = [
        [createGridValue(2), createGridValue(2), createGridValue(1)]
    ];
    const rowSums = [3];
    const columnSums = [3, 3, 3];
    const input = createGridModel(grid, rowSums, columnSums);

    const { value, modified } = selectUniqueSumValues(input);

    const expected = createGridModel([[createGridValue(2), createGridValue(2), createGridValue(1, false, true)]], [2], [3, 3, 2]);

    expect(modified).toBe(true);
    expect(value).toEqual(expected);
});

test('solves unique value in a column correctly', () => {
    const grid = [
        [createGridValue(2)],
        [createGridValue(2)],
        [createGridValue(1)]
    ];
    const rowSums = [3, 3, 3];
    const columnSums = [3];
    const input = createGridModel(grid, rowSums, columnSums);

    const { value, modified } = selectUniqueSumValues(input);

    const expected = createGridModel([[createGridValue(2)], [createGridValue(2)], [createGridValue(1, false, true)]], [3, 3, 2], [2]);

    expect(modified).toBe(true);
    expect(value).toEqual(expected);
});


test('solves multiple values in a row correctly', () => {
    const grid = [
        [createGridValue(3), createGridValue(3), createGridValue(1), createGridValue(1)]
    ];
    const rowSums = [5];
    const columnSums = [4, 4, 4, 4];
    const input = createGridModel(grid, rowSums, columnSums);

    const { value, modified } = selectUniqueSumValues(input);

    const expected = createGridModel([[createGridValue(3), createGridValue(3), createGridValue(1, false, true), createGridValue(1, false, true)]], [3], [4, 4, 3, 3]);

    expect(modified).toBe(true);
    expect(value).toEqual(expected);
});


test('solves multiple values in a column correctly', () => {
    const grid = [
        [createGridValue(3)], [createGridValue(3)], [createGridValue(1)], [createGridValue(1)]
    ];

    const rowSums = [4, 4, 4, 4];
    const columnSums = [5];
    const input = createGridModel(grid, rowSums, columnSums);

    const { value, modified } = selectUniqueSumValues(input);

    const expected = createGridModel([[createGridValue(3)], [createGridValue(3)], [createGridValue(1, false, true)], [createGridValue(1, false, true)]], [4, 4, 3, 3], [3]);

    expect(modified).toBe(true);
    expect(value).toEqual(expected);
});


test('reduceCombinations hides redundant values correctly', () => {
    const grid = [
        [createGridValue(2), createGridValue(3), createGridValue(4)],
        [createGridValue(3), createGridValue(1), createGridValue(3)]
    ];
    const rowSums = [5, 4];
    const columnSums = [5, 3, 3];
    const input = createGridModel(grid, rowSums, columnSums);

    const { value, modified } = reduceCombinations(input);

    const expected = createGridModel([
        [createGridValue(2), createGridValue(3), createGridValue(4, true)],
        [createGridValue(3), createGridValue(1, true), createGridValue(3)]
    ], rowSums, columnSums);

    expect(modified).toBe(true);
    expect(value).toEqual(expected);
});

test('selectSumValues solves all values when sums are correct', () => {
    const grid = [
        [createGridValue(2), createGridValue(3)],
        [createGridValue(3), createGridValue(1)]
    ];
    const rowSums = [5, 4];
    const columnSums = [5, 4];
    const input = createGridModel(grid, rowSums, columnSums);

    const { value, modified } = selectSumValues(input);

    const expected = createGridModel([
        [createGridValue(2, false, true), createGridValue(3, false, true)],
        [createGridValue(3, false, true), createGridValue(1, false, true)]
    ], [0, 0], [0, 0]);

    expect(modified).toBe(true);
    expect(value).toEqual(expected);
});