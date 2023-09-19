import { Prisma } from '@prisma/client';
import { json } from '@sveltejs/kit';

import { prisma } from '$lib/server/prisma';
import { newtonDividedDifference } from '$lib/solutions/newtonDivided';
import { generateId } from '$lib/utils';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const [input, errorValidate] = await validateInput(request);
	if (errorValidate) {
		return json(
			{
				status: 'error',
				error: {
					message: errorValidate.message
				}
			},
			{
				status: errorValidate.status
			}
		);
	}

	// console.log(input);
	return json({
		status: 'success',
		data: newtonDividedDifference(input.points, input.selected_point, input.x)
	});

	// const [result, error] = await new Promise((resolve) => {
	// 	try {
	// 		await prisma.$transaction(async (tx) => {
	// 			return;
	// 		});
	// 	} catch (error) {
	// 		console.error(error);
	// 		resolve([null, { message: 'Something went wrong!', status: 500 }]);
	// 	}
	// });

	// const problem = await prisma.problem.findFirst({
	// 	where: {
	// 		AND: [
	// 			{
	// 				input: {
	// 					path: '$.points',
	// 					equals: newPoints
	// 				}
	// 			},
	// 			{
	// 				input: {
	// 					path: '$.selected_point',
	// 					equals: selectedPoint
	// 				}
	// 			},
	// 			{
	// 				input: {
	// 					path: '$.x',
	// 					equals: x
	// 				}
	// 			},
	// 			{
	// 				problem_type: 'INTERPOLATION'
	// 			}
	// 		]
	// 	}
	// });

	// const session = await locals.auth.validate();
	// const userId = session?.user?.userId;

	// let problemId = problem ? problem.id : generateId();
	// if (problem == null) {
	// 	let isDup = true;
	// 	let tries = 0;
	// 	while (isDup && tries < 3) {
	// 		try {
	// 			tries++;
	// 			if (isDup) problemId = generateId();

	// 			await prisma.problem.create({
	// 				data: {
	// 					id: problemId,
	// 					problem_type: 'INTERPOLATION',
	// 					input: input,
	// 					user_id: userId
	// 				}
	// 			});
	// 			isDup = false;
	// 			break;
	// 		} catch (e) {
	// 			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
	// 				isDup = true;
	// 			} else {
	// 				console.error(e);
	// 				return json(
	// 					{
	// 						status: 'error',
	// 						error: {
	// 							message: 'Something went wrong!'
	// 						}
	// 					},
	// 					{
	// 						status: 500
	// 					}
	// 				);
	// 			}
	// 		}
	// 	}
	// }

	// const problemSolution = await prisma.problemSolved.findFirst({
	// 	where: {
	// 		problem_id: problemId,
	// 		solution_type: 'NEWTON_DIVIDED_DIFFERENCE'
	// 	}
	// });

	// if (problemSolution != null) {
	// 	await prisma.problemSolved.update({
	// 		where: {
	// 			id: problemSolution.id
	// 		},
	// 		data: {
	// 			solved_count: problemSolution.solved_count + 1
	// 		}
	// 	});

	// 	return json({
	// 		status: 'success',
	// 		data: problemSolution.output
	// 	});
	// }

	// const startTime = Date.now(); // ms
	// const result = newtonDividedDifference(newPoints, selectedPoint, x);
	// const endTime = Date.now(); // ms

	// let isDup = true;
	// let tries = 0;
	// let problemSolvedId = generateId();
	// while (isDup && tries < 3) {
	// 	try {
	// 		tries++;
	// 		if (isDup) problemSolvedId = generateId();

	// 		await prisma.problemSolved.create({
	// 			data: {
	// 				id: problemSolvedId,
	// 				output: JSON.stringify(result),
	// 				solution_type: 'NEWTON_DIVIDED_DIFFERENCE',
	// 				executed_time: endTime - startTime,
	// 				user_id: userId,
	// 				problem_id: problemId,
	// 				iteration_count: 0
	// 			}
	// 		});

	// 		isDup = false;
	// 		break;
	// 	} catch (e) {
	// 		console.error('d', e);
	// 		if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
	// 			isDup = true;
	// 		} else {
	// 			return json(
	// 				{
	// 					status: 'error',
	// 					error: {
	// 						message: 'Something went wrong!'
	// 					}
	// 				},
	// 				{
	// 					status: 500
	// 				}
	// 			);
	// 		}
	// 	}
	// }

	// return json({
	// 	status: 'success',
	// 	data: result
	// });
};

async function validateInput(
	request: Request
): Promise<[any | null, { message: string; status: number } | null]> {
	let dataJson;
	try {
		dataJson = await request.json();
	} catch (e) {
		return [
			null,
			{
				message: 'Invalid JSON!',
				status: 400
			}
		];
	}

	const { points, selected_point, x } = dataJson;
	const selectedPoint = selected_point;

	if (!points || !selectedPoint || !x) {
		return [
			null,
			{
				message: 'Points, Selected Point and X is required!',
				status: 400
			}
		];
	}

	if (points.length < 2) {
		return [
			null,
			{
				message: 'At least 2 points is required!',
				status: 400
			}
		];
	}

	// check all points is valid
	const newPoints = [];
	for (const point of points) {
		if (typeof point.x != 'number' || typeof point.y != 'number') {
			return [
				null,
				{
					message: 'Invalid point!',
					status: 400
				}
			];
		}

		newPoints.push({
			x: point.x,
			y: point.y
		});
	}

	for (const x of selectedPoint) {
		if (typeof x != 'number') {
			return [
				null,
				{
					message: 'Invalid selected point!',
					status: 400
				}
			];
		}

		if (!newPoints.find((p) => p.x == x)) {
			return [
				null,
				{
					message: 'Invalid selected point!',
					status: 400
				}
			];
		}
	}

	return [
		{
			points: newPoints,
			selected_point: selectedPoint,
			x: x
		},
		null
	];
}
