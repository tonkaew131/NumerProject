import { json } from '@sveltejs/kit';

import {
	InterpolationProblem,
	NewtonDividedDifferenceSolver
} from '$lib/server/interpolationProblem';

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

	const problem = new InterpolationProblem(JSON.stringify(dataJson));
	problem.setUserId(userId);

	const [input, inputError] = problem.formatInput();
	if (inputError) {
		return json(
			{
				status: 'error',
				error: inputError
			},
			{
				status: inputError.status
			}
		);
	}

	if (input == null) {
		return json(
			{
				status: 'error',
				error: 'Something went wrong!'
			},
			{
				status: 500
			}
		);
	}

	const [problemId, problemIdError] = await problem.getProblemId('create');
	if (problemIdError) {
		return json(
			{
				status: 'error',
				error: problemIdError.message
			},
			{
				status: problemIdError.status
			}
		);
	}

	if (problemId == undefined) {
		return json(
			{
				status: 'error',
				error: 'Something went wrong!'
			},
			{
				status: 500
			}
		);
	}

	const problemSolved = new NewtonDividedDifferenceSolver(problem);
	problemSolved.setUserId(userId);

	const [output, outputError] = await problemSolved.getOutput();
	if (outputError) {
		return json(
			{
				status: 'error',
				error: outputError.message
			},
			{
				status: outputError.status
			}
		);
	}

	if (output == null) {
		return json(
			{
				status: 'error',
				error: 'Something went wrong!'
			},
			{
				status: 500
			}
		);
	}

	return json({
		status: 'success',
		data: output
	});
};
