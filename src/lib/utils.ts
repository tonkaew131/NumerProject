import { type ClassValue, clsx } from 'clsx';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

// by @tonkaew131
export const createMatrix = (matrixSize: number) => {
	const matrix = new Array(Number(matrixSize));
	for (let i = 0; i < matrixSize; i++) {
		matrix[i] = new Array(Number(matrixSize));
	}
	return matrix;
};

export const createArray = (matrixSize: number) => {
	const array = new Array(Number(matrixSize));
	return array;
};

export const copyMatrix = (matrix: number[][]) => {
	const newMatrix: number[][] = [];
	for (let i = 0; i < matrix.length; i++) {
		newMatrix[i] = [];
		for (let j = 0; j < matrix[i].length; j++) {
			newMatrix[i][j] = matrix[i][j];
		}
	}
	return newMatrix;
};

export const getMatrixSize = (
	matrix: number[][]
): [{ row: number; col: number } | null, Error | null] => {
	const baseRow = matrix.length;
	const baseCol = matrix[0].length;

	matrix.forEach((m: number[]) => {
		if (m.length != baseCol) return [null, new Error('Not a matrix')];
	});

	return [{ row: baseRow, col: baseCol }, null];
};

export const generateId = (length = 6): string => {
	const allowedChar = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');

	const output = [];
	for (let i = 0; i < length; i++) {
		output.push(allowedChar[Math.floor(Math.random() * allowedChar.length)]);
	}
	return output.join('');
};

export const isValidMatrix = (matrix: unknown): boolean => {
	if (typeof matrix !== 'object' || typeof matrix == null) {
		return false;
	}

	const matrixObj = Object(matrix);

	// not iterable
	if (typeof matrixObj[Symbol.iterator] !== 'function') {
		return false;
	}

	for (const row in matrixObj) {
		if (typeof row !== 'object' || typeof row == null) {
			return false;
		}

		const rowObj = Object(row);

		// not iterable
		if (typeof rowObj[Symbol.iterator] !== 'function') {
			return false;
		}

		for (const col in rowObj) {
			if (typeof col == null || isNaN(Number(col))) {
				return false;
			}
		}
	}

	return true;
};

export const isValidArray = (array: unknown): boolean => {
	if (typeof array !== 'object' || typeof array == null) {
		return false;
	}

	const arrayObj = Object(array);

	// not iterable
	if (typeof arrayObj[Symbol.iterator] !== 'function') {
		return false;
	}

	for (const row in arrayObj) {
		if (typeof row == null || isNaN(Number(row))) {
			return false;
		}
	}

	return true;
};

export const formatMatrix = (matrix: unknown): number[][] | null => {
	if (typeof matrix !== 'object' || typeof matrix == null) {
		return null;
	}

	const matrixObj = Object(matrix);

	// not iterable
	if (typeof matrixObj[Symbol.iterator] !== 'function') {
		return null;
	}

	const newMatrix: number[][] = [];
	const baseCol: number = matrixObj[0].length;

	for (let i = 0; i < matrixObj.length; i++) {
		const row = matrixObj[i];
		if (typeof row !== 'object' || typeof row == null) {
			return null;
		}

		const rowObj = Object(row);

		// not iterable
		if (typeof rowObj[Symbol.iterator] !== 'function') {
			return null;
		}

		const newRow: number[] = [];

		if (rowObj.length != baseCol) {
			return null;
		}

		for (let j = 0; j < rowObj.length; j++) {
			const col = rowObj[j];
			if (typeof col == null || isNaN(Number(col))) {
				return null;
			}

			newRow.push(Number(col));
		}

		newMatrix.push(newRow);
	}

	return newMatrix;
};

export const formatArray = (array: unknown): number[] | null => {
	if (typeof array !== 'object' || typeof array == null) {
		return null;
	}

	const arrayObj = Object(array);

	// not iterable
	if (typeof arrayObj[Symbol.iterator] !== 'function') {
		return null;
	}

	const newArray: number[] = [];

	for (let i = 0; i < arrayObj.length; i++) {
		const row = arrayObj[i];

		if (typeof row == null || isNaN(Number(row))) {
			return null;
		}

		newArray.push(Number(row));
	}

	return newArray;
};
