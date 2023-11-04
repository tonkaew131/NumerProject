import { json } from '@sveltejs/kit';

import { LinearEquationProblem, LUDecompositionSolver } from '$lib/server/linearEquationProblem';
import { luDecomposition } from '$lib/solutions/linear-algebra-equation/lu-decomposition/lu-decomposition';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	let dataJson;
	try {
		dataJson = await request.json();
	} catch (err) {
		return json(
			{
				status: 'error',
				error: {
					message: 'Invalid JSON!'
				}
			},
			{
				status: 400
			}
		);
	}

	const session = await locals.auth.validate();
	const userId = session?.user?.userId;

	const problem = new LinearEquationProblem(JSON.stringify(dataJson));
	problem.setUserId(userId);

	const [input, inputError] = problem.formatInput();
	// IMPORTANT
	if (inputError || input == null) {
		return jsonError(inputError?.message || 'Something went wrong!', 500);
	}

	const [problemId, problemIdError] = await problem.getProblemId('create');
	// WARNING
	if (problemIdError || problemId == undefined) {
		const result = luDecomposition(input.matrixA, input.arrayB);

		return jsonWarning(
			'There is problem craeting the problem... show the result without saving it.',
			200,
			result
		);
	}

	const problemSolved = new LUDecompositionSolver(problem);
	problemSolved.setUserId(userId);

	const [output, outputError] = await problemSolved.getOutput();
	// WARNING
	if (outputError || output == null) {
		const result = luDecomposition(input.matrixA, input.arrayB);

		return jsonWarning(
			'There is problem saving the solution... show the result without saving it.',
			200,
			result
		);
	}

	if ('error' in output && output.error) {
		return jsonError(String(output.error), 400);
	}

	return json({
		status: 'success',
		data: output
	});
};

function jsonError(message: string, status: number) {
	return json(
		{
			status: 'error',
			error: {
				message
			}
		},
		{
			status
		}
	);
}

function jsonWarning(message: string, status: number, data: object) {
	return json(
		{
			status: 'warning',
			data,
			warning: {
				message
			}
		},
		{
			status
		}
	);
}
