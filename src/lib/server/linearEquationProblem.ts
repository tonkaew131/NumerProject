import { cramerRule } from '$lib/solutions/cramer';
import { guassEliminationMethods } from '$lib/solutions/guass';
import { formatArray, formatMatrix, generateId } from '$lib/utils';

import { guassJordanMethod } from '../solutions/guassJordan';
import { prisma } from './prisma';
import { Problem, ProblemSolver } from './problem';

export class LinearEquationProblem extends Problem {
	constructor(input: string) {
		super(input, 'LINEAR_ALGEBRA_EQUATION');
	}

	formatInput(): [
		null | { matrixA: number[][]; arrayB: number[] },
		null | { message: string; status: number }
	] {
		let dataJson;
		try {
			dataJson = JSON.parse(this.input);
		} catch (err) {
			return [
				null,
				{
					message: 'Invalid JSON!',
					status: 400
				}
			];
		}

		const { matrixA, arrayB } = dataJson;

		const newMatrixA = formatMatrix(matrixA);
		if (newMatrixA == null) {
			return [
				null,
				{
					message: 'Matrix A is required!',
					status: 400
				}
			];
		}

		const newArrayB = formatArray(arrayB);
		if (newArrayB == null) {
			return [
				null,
				{
					message: 'Array B is required!',
					status: 400
				}
			];
		}

		const newData = {
			matrixA: newMatrixA,
			arrayB: newArrayB
		};

		this.input = JSON.stringify(newData);
		return [newData, null];
	}

	async getProblemId(
		mode: 'select' | 'create' = 'select'
	): Promise<[null | string | undefined, null | { message: string; status: number }]> {
		if (this.problemId != undefined) return [this.problemId, null];

		const { matrixA, arrayB } = JSON.parse(this.input);

		let problem;
		try {
			problem = await prisma.problem.findFirst({
				where: {
					AND: [
						{
							input: {
								path: '$.matrixA',
								equals: matrixA
							}
						},
						{
							input: {
								path: '$.arrayB',
								equals: arrayB
							}
						},
						{
							problem_type: 'LINEAR_ALGEBRA_EQUATION'
						}
					]
				}
			});
		} catch (err) {
			return [null, { message: 'Something went wrong!', status: 500 }];
		}

		let problemId = problem?.id;
		if (mode == 'create' && !problem) {
			problemId = generateId();
			try {
				await prisma.problem.create({
					data: {
						id: problemId,
						problem_type: 'LINEAR_ALGEBRA_EQUATION',
						input: JSON.parse(this.input),
						user_id: this.userId
					}
				});
			} catch (err) {
				return [null, { message: 'Something went wrong!', status: 500 }];
			}
		}

		this.problemId = problemId;
		return [problemId, null];
	}
}

export class CramerSolver extends ProblemSolver {
	constructor(problem: Problem) {
		super(problem, 'CRAMER');
	}

	async getOutput(): Promise<[object | null, { message: string; status: number } | null]> {
		const [solverId, solverIdError] = await this.getProblemSolverId();
		if (solverIdError) return [null, solverIdError];

		const [problemId, problemIdError] = await this.problem.getProblemId('select');
		if (problemIdError) return [null, problemIdError];
		if (!problemId) return [null, { message: 'Something went wrong!', status: 500 }];

		if (solverId == undefined) {
			const input = JSON.parse(this.problem.getInput());
			const startTime = Date.now(); // ms
			const output = cramerRule(input.matrixA, input.arrayB);
			const endTime = Date.now(); // ms

			this.problemSolverId = generateId();
			await prisma.problemSolved.create({
				data: {
					id: this.problemSolverId,
					output: JSON.parse(JSON.stringify(output)),
					solution_type: 'CRAMER',
					executed_time: endTime - startTime,
					user_id: this.userId,
					problem_id: problemId,
					iteration_count: 0
				}
			});

			return [output, null];
		}

		await prisma.problemSolved.update({
			where: {
				id: this.problemSolverId
			},
			data: {
				solved_count: {
					increment: 1
				}
			}
		});

		if (this.output != undefined) return [JSON.parse(this.output), null];
		return [null, { message: 'Something went wrong!', status: 500 }];
	}
}

export class GuassEliminationSolver extends ProblemSolver {
	constructor(problem: Problem) {
		super(problem, 'GUASS');
	}

	async getOutput(): Promise<[object | null, { message: string; status: number } | null]> {
		const [solverId, solverIdError] = await this.getProblemSolverId();
		if (solverIdError) return [null, solverIdError];

		const [problemId, problemIdError] = await this.problem.getProblemId('select');
		if (problemIdError) return [null, problemIdError];
		if (!problemId) return [null, { message: 'Something went wrong!', status: 500 }];

		if (solverId == undefined) {
			const input = JSON.parse(this.problem.getInput());
			const startTime = Date.now(); // ms
			const output = guassEliminationMethods(input.matrixA, input.arrayB);
			const endTime = Date.now(); // ms

			this.problemSolverId = generateId();
			await prisma.problemSolved.create({
				data: {
					id: this.problemSolverId,
					output: JSON.parse(JSON.stringify(output)),
					solution_type: 'GUASS',
					executed_time: endTime - startTime,
					user_id: this.userId,
					problem_id: problemId,
					iteration_count: 0
				}
			});

			return [output, null];
		}

		await prisma.problemSolved.update({
			where: {
				id: this.problemSolverId
			},
			data: {
				solved_count: {
					increment: 1
				}
			}
		});

		if (this.output != undefined) return [JSON.parse(this.output), null];
		return [null, { message: 'Something went wrong!', status: 500 }];
	}
}

export class GuassJordanSolver extends ProblemSolver {
	constructor(problem: Problem) {
		super(problem, 'GUASS_JORDAN');
	}

	async getOutput(): Promise<[object | null, { message: string; status: number } | null]> {
		const [solverId, solverIdError] = await this.getProblemSolverId();
		if (solverIdError) return [null, solverIdError];

		const [problemId, problemIdError] = await this.problem.getProblemId('select');
		if (problemIdError) return [null, problemIdError];
		if (!problemId) return [null, { message: 'Something went wrong!', status: 500 }];

		if (solverId == undefined) {
			const input = JSON.parse(this.problem.getInput());
			const startTime = Date.now(); // ms
			const output = guassJordanMethod(input.matrixA, input.arrayB);
			const endTime = Date.now(); // ms

			delete output.iterations;

			this.problemSolverId = generateId();
			await prisma.problemSolved.create({
				data: {
					id: this.problemSolverId,
					output: JSON.parse(JSON.stringify(output)),
					solution_type: 'GUASS_JORDAN',
					executed_time: endTime - startTime,
					user_id: this.userId,
					problem_id: problemId,
					iteration_count: 0
				}
			});

			const outputIteration = guassJordanMethod(input.matrixA, input.arrayB);

			return [outputIteration, null];
		}

		await prisma.problemSolved.update({
			where: {
				id: this.problemSolverId
			},
			data: {
				solved_count: {
					increment: 1
				}
			}
		});

		if (this.output != undefined) return [JSON.parse(this.output), null];
		return [null, { message: 'Something went wrong!', status: 500 }];
	}
}
