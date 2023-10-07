import { json } from '@sveltejs/kit';

import { extrapolationProblem, SimpleRegressionSolver } from '$lib/server/extrapolationProblem';
import { simpleRegression } from '$lib/solutions/simpleRegression';

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

	const problem = new extrapolationProblem(JSON.stringify(dataJson));
	problem.setUserId(userId);

	const [input, inputError] = problem.formatInput();
	// IMPORTANT
	if (inputError || input == null) {
		return json(
			{
				status: 'error',
				error: inputError || 'Something went wrong!'
			},
			{
				status: inputError?.status || 500
			}
		);
	}

	const [problemId, problemIdError] = await problem.getProblemId('create');
	// WARNING
	if (problemIdError || problemId == undefined) {
		const result = simpleRegression(input.points, input.x, input.m);

		return json(
			{
				status: 'warning',
				data: result,
				warning: {
					message: 'There is problem craeting the problem... show the result without saving it.'
				}
			},
			{
				status: 200
			}
		);
	}

	const problemSolved = new SimpleRegressionSolver(problem);
	problemSolved.setUserId(userId);

	const [output, outputError] = await problemSolved.getOutput();
	// WARNING
	if (outputError || output == null) {
		const result = simpleRegression(input.points, input.x, input.m);

		return json(
			{
				status: 'warning',
				data: result,
				warning: {
					message: 'There is problem saving the solution... show the result without saving it.'
				}
			},
			{
				status: 200
			}
		);
	}

	if (output.error) {
		return json(
			{
				status: 'error',
				data: output,
				error: {
					message: output.error
				}
			},
			{
				status: 400
			}
		);
	}

	return json({
		status: 'success',
		data: output
	});
};
