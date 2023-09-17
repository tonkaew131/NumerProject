import { generateId, getMatrixSize } from '$lib/utils';

import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';
import { guassEliminationMethods, type GuassType } from '$lib/solutions/guass';
import { prisma } from '$lib/server/prisma';

export const POST: RequestHandler = async ({ request, locals }) => {
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

	const problem = await prisma.problem.findFirst({
		where: {
			AND: [
				{
					input: {
						path: '$.matrix_a',
						equals: matrixA
					}
				},
				{
					input: {
						path: '$.array_b',
						equals: arrayB
					}
				},
				{
					problem_type: 'LINEAR_ALGEBRA_EQUATION'
				}
			]
		}
	});

	const session = await locals.auth.validate();
	const userId = session?.user?.userId;

	const problemId = problem ? problem.id : generateId();
	if (problem == null) {
		await prisma.problem.create({
			data: {
				id: problemId,
				problem_type: 'LINEAR_ALGEBRA_EQUATION',
				input: input,
				user_id: userId
			}
		});
	}

	const problemSolution = await prisma.problemSolved.findFirst({
		where: {
			problem_id: problemId,
			solution_type: 'GUASS'
		}
	});

	if (problemSolution != null) {
		await prisma.problemSolved.update({
			where: {
				id: problemSolution.id
			},
			data: {
				solved_count: problemSolution.solved_count + 1
			}
		});

		return json({
			status: 'success',
			data: problemSolution.output
		});
	}

	const startTime = Date.now(); // ms
	const data: GuassType = guassEliminationMethods(matrixA, arrayB);
	const endTime = Date.now(); // ms

	await prisma.problemSolved.create({
		data: {
			id: generateId(),
			output: JSON.stringify(data),
			solution_type: 'GUASS',
			executed_time: endTime - startTime,
			user_id: userId,
			problem_id: problemId
		}
	});

	return json({
		status: 'success',
		data: data
	});
};
