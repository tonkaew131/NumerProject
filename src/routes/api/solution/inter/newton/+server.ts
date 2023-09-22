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
		return json(
			{
				status: 'error',
				error: problemIdError || 'Something went wrong!'
			},
			{
				status: problemIdError?.status || 500
			}
		);
	}

	const problemSolved = new NewtonDividedDifferenceSolver(problem);
	problemSolved.setUserId(userId);

	const [output, outputError] = await problemSolved.getOutput();
	// WARNING
	if (outputError || output == null) {
		return json(
			{
				status: 'error',
				error: outputError?.message || 'Something went wrong!'
			},
			{
				status: outputError?.status || 500
			}
		);
	}

	return json({
		status: 'success',
		data: output
	});
};
