import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

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

export const generateId = (length = 16): string => {
	const allowedChar = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');

	const output = [];
	for (let i = 0; i < length; i++) {
		output.push(allowedChar[Math.floor(Math.random() * allowedChar.length)]);
	}
	return output.join('');
};
