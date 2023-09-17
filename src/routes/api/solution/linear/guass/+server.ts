import { getMatrixSize } from '$lib/utils';

import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';
import { guassEliminationMethods, type GuassType } from '$lib/solutions/guass';

export const POST: RequestHandler = async ({ request }) => {
	const dataJson = await request.json();

	const { matrix_a, array_b } = dataJson;
	const matrixA = matrix_a;
	const arrayB = array_b;
	if (!matrixA || !arrayB) {
		return json(
			{
				status: 'error',
				error: {
					message: 'Matrix A & Matrix B is required!'
				}
			},
			{
				status: 400
			}
		);
	}

	const [matrixASize, matrixAError] = getMatrixSize(matrixA);
	if (matrixAError != null) {
		return json(
			{
				status: 'error',
				error: {
					message: matrixAError.message
				}
			},
			{
				status: 400
			}
		);
	}

	if (matrixASize?.col != matrixASize?.row) {
		return json(
			{
				status: 'error',
				error: {
					message: 'Not a square matrix'
				}
			},
			{
				status: 400
			}
		);
	}

	if (matrixASize?.col != arrayB.length) {
		return json(
			{
				status: 'error',
				error: {
					message: "Matrix A & Array B's size not equals"
				}
			},
			{
				status: 400
			}
		);
	}

	const input = { matrix_a: matrixA, array_b: arrayB };
	console.log(JSON.stringify(input));

	const data: GuassType = guassEliminationMethods(matrixA, arrayB);
	return json({
		status: 'success',
		data: data
	});
};
