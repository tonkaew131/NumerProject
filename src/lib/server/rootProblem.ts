import { evaluate } from 'mathjs';

import { bisectionSearch } from '$lib/solutions/bisection';
import { falsePositionMethod } from '$lib/solutions/falsePosition';
import { graphicalMethod } from '$lib/solutions/graphical';

import { generateId } from '../utils';
import { prisma } from './prisma';
import { Problem, ProblemSolver } from './problem';

export class RootOfEquationProblem extends Problem {
	constructor(input: string) {
		super(input, 'ROOT_OF_EQUATION');
	}

	formatInput(): [
		null | { xStart: number; xEnd: number; errorFactor: number; func: string },
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

		const { xStart, xEnd, errorFactor, func } = dataJson;

		if (xStart == null || isNaN(xStart)) {
			return [
				null,
				{
					message: 'xStart is required!',
					status: 400
				}
			];
		}
		const newXStart = Number(xStart);
		if (xEnd == null || isNaN(xEnd)) {
			return [
				null,
				{
					message: 'xEnd is required!',
					status: 400
				}
			];
		}
		const newXEnd = Number(xEnd);
		if (errorFactor == null || isNaN(errorFactor)) {
			return [
				null,
				{
					message: 'errorFactor is required!',
					status: 400
				}
			];
		}
		const newError = Number(errorFactor);
		if (func == null || typeof func != 'string') {
			return [
				null,
				{
					message: 'func is required!',
					status: 400
				}
			];
		}

		try {
			evaluate(func, { x: newXStart });
		} catch (err) {
			return [
				null,
				{
					message: 'Invalid function!',
					status: 400
				}
			];
		}

		const newData = {
			xStart: newXStart,
			xEnd: newXEnd,
			errorFactor: newError,
			func: func
		};

		this.input = JSON.stringify(newData);
		return [newData, null];
	}

	async getProblemId(
		mode: 'select' | 'create' = 'select'
	): Promise<[null | string | undefined, null | { message: string; status: number }]> {
		if (this.problemId != undefined) return [this.problemId, null];

		const { xStart, xEnd, errorFactor, func } = JSON.parse(this.input);

		let problem;
		try {
			problem = await prisma.problem.findFirst({
				where: {
					AND: [
						{
							input: {
								path: '$.xStart',
								equals: xStart
							}
						},
						{
							input: {
								path: '$.xEnd',
								equals: xEnd
							}
						},
						{
							input: {
								path: '$.errorFactor',
								equals: errorFactor
							}
						},
						{
							input: {
								path: '$.func',
								equals: func
							}
						},
						{
							problem_type: 'ROOT_OF_EQUATION'
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
						problem_type: 'ROOT_OF_EQUATION',
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

export class GraphicalMethodSolver extends ProblemSolver {
	constructor(problem: Problem) {
		super(problem, 'GRAPHICAL');
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
			const output = graphicalMethod(input.xStart, input.xEnd, input.errorFactor, input.func);
			const endTime = Date.now(); // ms

			delete output.iterations;

			this.problemSolverId = generateId();
			await prisma.problemSolved.create({
				data: {
					id: this.problemSolverId,
					output: JSON.parse(JSON.stringify(output)),
					solution_type: 'GRAPHICAL',
					executed_time: endTime - startTime,
					user_id: this.userId,
					problem_id: problemId,
					iteration_count: output.iter
				}
			});

			const outputIterations = graphicalMethod(
				input.xStart,
				input.xEnd,
				input.errorFactor,
				input.func
			);
			return [outputIterations, null];
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

export class BisectionSearchSolver extends ProblemSolver {
	constructor(problem: Problem) {
		super(problem, 'BISECTION');
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
			const output = bisectionSearch(input.xStart, input.xEnd, input.errorFactor, input.func);
			const endTime = Date.now(); // ms

			delete output.iterations;

			this.problemSolverId = generateId();
			await prisma.problemSolved.create({
				data: {
					id: this.problemSolverId,
					output: JSON.parse(JSON.stringify(output)),
					solution_type: 'BISECTION',
					executed_time: endTime - startTime,
					user_id: this.userId,
					problem_id: problemId,
					iteration_count: output.iter
				}
			});

			const outputIterations = bisectionSearch(
				input.xStart,
				input.xEnd,
				input.errorFactor,
				input.func
			);
			return [outputIterations, null];
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

export class FalsePositionSolver extends ProblemSolver {
	constructor(problem: Problem) {
		super(problem, 'FALSE_POSITION');
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
			const output = falsePositionMethod(input.xStart, input.xEnd, input.errorFactor, input.func);
			const endTime = Date.now(); // ms

			delete output.iterations;

			this.problemSolverId = generateId();
			await prisma.problemSolved.create({
				data: {
					id: this.problemSolverId,
					output: JSON.parse(JSON.stringify(output)),
					solution_type: 'FALSE_POSITION',
					executed_time: endTime - startTime,
					user_id: this.userId,
					problem_id: problemId,
					iteration_count: output.iter
				}
			});

			const outputIterations = falsePositionMethod(
				input.xStart,
				input.xEnd,
				input.errorFactor,
				input.func
			);
			return [outputIterations, null];
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
