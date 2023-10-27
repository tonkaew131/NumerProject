import { evaluate } from 'mathjs';

import { differentiation } from '$lib/solutions/differentiation';

import { formatNumber, generateId } from '../utils';
import { prisma } from './prisma';
import { Problem, ProblemSolver } from './problem';

export class DifferentiationProblem extends Problem {
	constructor(input: string) {
		super(input, 'DIFFERENTIATION');
	}

	formatInput(): [
		null | {
			order: number;
			error: string;
			direction: string;
			func: string;
			x: number;
			h: number;
		},
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

		const { order, error, direction, func, x, h } = dataJson;

		const newOrder = formatNumber(order);
		if (newOrder == null) {
			return [
				null,
				{
					message: 'Invalid order!',
					status: 400
				}
			];
		}

		if (direction != 'forward' && direction != 'backward' && direction != 'centered') {
			return [
				null,
				{
					message: 'Invalid direction!',
					status: 400
				}
			];
		}

		const newX = formatNumber(x);
		if (newX == null) {
			return [
				null,
				{
					message: 'Invalid x!',
					status: 400
				}
			];
		}

		const newH = formatNumber(h);
		if (newH == null) {
			return [
				null,
				{
					message: 'Invalid h!',
					status: 400
				}
			];
		}

		if (typeof func != 'string' || func.trim().length == 0) {
			return [
				null,
				{
					message: 'Invalid function!',
					status: 400
				}
			];
		}

		try {
			evaluate(func, { x: newX });
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
			order: newOrder,
			error,
			direction,
			func,
			x: newX,
			h: newH
		};

		this.input = JSON.stringify(newData);
		return [newData, null];
	}

	async getProblemId(
		mode: 'select' | 'create' = 'select'
	): Promise<[null | string | undefined, null | { message: string; status: number }]> {
		if (this.problemId != undefined) return [this.problemId, null];

		const { order, error, direction, func, x, h } = JSON.parse(this.input);

		let problem;
		try {
			problem = await prisma.problem.findFirst({
				where: {
					AND: [
						{
							input: {
								path: '$.order',
								equals: order
							}
						},
						{
							input: {
								path: '$.error',
								equals: error
							}
						},
						{
							input: {
								path: '$.direction',
								equals: direction
							}
						},
						{
							input: {
								path: '$.func',
								equals: func
							}
						},
						{
							input: {
								path: '$.x',
								equals: x
							}
						},
						{
							input: {
								path: '$.h',
								equals: h
							}
						},
						{
							problem_type: 'DIFFERENTIATION'
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
						problem_type: 'DIFFERENTIATION',
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

export class DifferentiationSolver extends ProblemSolver {
	constructor(problem: Problem) {
		super(problem, 'DIFFERENTIATION');
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
			const output = differentiation(input.func, input.x, input.h, input.order, input.error, input.direction);
			const endTime = Date.now(); // ms

			this.problemSolverId = generateId();
			await prisma.problemSolved.create({
				data: {
					id: this.problemSolverId,
					output: JSON.parse(JSON.stringify(output)),
					solution_type: 'DIFFERENTIATION',
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
