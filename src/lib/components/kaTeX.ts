import type { MathArray, Matrix } from 'mathjs';

export function formatMatrix(matrix: MathArray | Matrix | number[], precision = 6) {
	let out = '';
	matrix.forEach((m) => {
		out += `${Number(m).toFixed(precision)} \\\\`;
	});

	return `\\begin{Bmatrix}
        ${out}
    \\end{Bmatrix}`;
}
