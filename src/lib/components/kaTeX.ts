import type { MathArray, Matrix } from 'mathjs';

export function formatVector(matrix: MathArray | Matrix | number[], precision = 6) {
	let out = '';
	matrix.forEach((m) => {
		out += `${Number(m).toFixed(precision)} \\\\`;
	});

	return `\\begin{Bmatrix}
        ${out}
    \\end{Bmatrix}`;
}

export function formatMatrix(
	matrix: MathArray | Matrix | number[][],
	precision = 6,
	highlight?: number[][]
) {
	let out = '';
	matrix.forEach((m, row) => {
		m.forEach((n: number, idx: number) => {
			let isHighlighted = false;
			highlight?.forEach((h) => {
				if (row == h[0] && idx == h[1]) {
					isHighlighted = true;
					return;
				}
			});

			if (isHighlighted) {
				out += `\\color{red}{${Number(n).toFixed(precision)}}`;
			} else {
				out += `${Number(n).toFixed(precision)}`;
			}
			out += ` ${idx == m.length - 1 ? '' : '&'} `;
		});
		out += `\\\\`;
	});

	return `\\begin{bmatrix}
		${out}
	\\end{bmatrix}`;
}
